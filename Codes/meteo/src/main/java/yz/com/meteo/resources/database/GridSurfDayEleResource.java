package yz.com.meteo.resources.database;

import java.io.File;
import java.lang.reflect.Field;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import yz.com.bean.znq.AreaCod;
import yz.com.bean.znq.StatCod;
import yz.com.bean.znq.SurfDayEle;
import yz.com.core.ErrorCodeEnum;
import yz.com.core.exception.ResourceException;
import yz.com.core.models.gdal.GridExtent;
import yz.com.core.models.gdal.Point3D;
import yz.com.meteo.config.ApiConfig;
import yz.com.meteo.enums.GridAlgorithm;
import yz.com.meteo.enums.RasterFormat;
import yz.com.meteo.utils.GDALHelper;
import yz.com.meteo.utils.MapnikHelper;
import yz.com.meteo.utils.OGRHelper;
import yz.com.models.UrlUser;
import yz.com.resources.database.AreaCodResource;
import yz.com.resources.database.StatCodResource;
import yz.com.resources.database.SurfDayEleResource;
import yz.com.resources.enums.AreaLevelEnum;
import yz.com.resources.utils.SpringHelper;

@Primary
@Service
public class GridSurfDayEleResource extends SurfDayEleResource {

	@Autowired
	private ApiConfig apiConf;

	public FileSystemResource createGrid(int areaCode, Map<String, Object> params) throws ResourceException {
		Map<String, Object> newParams = this.parseParams(params);

		// 获取插值字段信息
		String gridEleName = newParams.get("velement").toString();
		Map<String, Field> fieldMap = this.getFields(SurfDayEle.class);
		Field gridField = fieldMap.get(gridEleName);

		// 获取插值区域
		AreaCodResource areaResc = SpringHelper.getBean(AreaCodResource.class);
		AreaCod area = areaResc.getBykey(areaCode);

		// 获取站点信息
		// Map<String, Object> statParams = new HashMap<String, Object>();
		// String strCode = Integer.toString(areaCode).substring(0,
		// area.getvLevel()*2);
		// statParams.put("cCode", strCode + "%");

		List<Point3D> pointList = getSurfDayEle(newParams, gridField);

		// 获取插值的栅格区域文件
		String rasterFileName = getRasterFile(area);
		List<Point3D> areaPoints = GDALHelper.getInstance().readFile(rasterFileName, 1);
		GridExtent ext = GDALHelper.getInstance().getGridExtent(rasterFileName);

		if (areaPoints == null)
			throw new ResourceException(ErrorCodeEnum.ERROR_NULLPARAMS_RESOURCE, "没有找到相应区域的栅格数据！");

		// 插值
		ByteBuffer buffer = GDALHelper.getInstance().GridCreate(GridAlgorithm.InverseDistanceToAPower, ext, pointList);
		List<Point3D> gridPoints = GDALHelper.getInstance().ToGridPoints(ext, buffer);

		// 过滤
		// List<Point3D> filterPoints =
		// OGRHelper.getInstance().fliterByGeometry(gridPoints, shpFileName,
		// attriWhere);

		for (int i = 0; i < areaPoints.size(); i++) {
			if (areaPoints.get(i).getData() != -999 && gridPoints.get(i) != null)
				areaPoints.get(i).setData(gridPoints.get(i).getData());
		}

		// 写入文件
		ByteBuffer filterBuffer = GDALHelper.getInstance().ToGridByteBuffer(ext, areaPoints);// filterPoints
		filterBuffer.rewind();

		// 保存到用户路径
		String savePath = SpringHelper.getCurrUser(UrlUser.class).getTempDir();
		if (savePath != null && !savePath.isEmpty()) {
			File savePathFile = new File(savePath);
			if (!savePathFile.exists())
				savePathFile.mkdir();

			// 渲染
			String fileName = savePathFile.getAbsolutePath() + "/" + areaCode + ".img";
			GDALHelper.getInstance().WriteRaster(RasterFormat.ENVI, ext, filterBuffer, fileName, false);

			MapnikHelper.getInstance().setPythonPath(apiConf.getPythonPath());
			int rc = MapnikHelper.getInstance().Render(fileName, ext, gridEleName);

			if (rc == 0) {
				String pngFileName = savePathFile.getAbsolutePath() + "/" + areaCode + ".png";
				File pngFile = new File(pngFileName);
				return this.getContent(pngFile);
			}
		} else {
			throw new ResourceException(ErrorCodeEnum.ERROR_PARAMSNOTEXIST_RESOURCE, "User temp dir is not exist! ");
		}

		return null;
	}

	/**
	 * 获取日资料数据
	 * 
	 * @param newParams
	 *            查询条件
	 * @param gridField
	 *            统计字段
	 * @return 点数据
	 */
	private List<Point3D> getSurfDayEle(Map<String, Object> newParams, Field gridField) {
		StatCodResource statCodResv = SpringHelper.getBean(StatCodResource.class);
		List<StatCod> statList = statCodResv.getAll();// statCodResv.getByCondition(statParams);
		Map<Integer, StatCod> statMap = statList.stream()
				.collect(Collectors.toMap(StatCod::getV01000, a -> a, (k1, k2) -> k1));

		// 获取数据
		List<Point3D> pointList = new ArrayList<Point3D>();
		List<SurfDayEle> infoList = this.getAllByCondition(newParams);

		// 组装成点数据
		for (int i = 0; i < infoList.size(); i++) {
			SurfDayEle info = infoList.get(i);
			int v01000 = info.getV01000();
			double value = 0.0;

			try {
				Object oValue = gridField.get(info);

				if (oValue != null)
					value = Double.parseDouble(oValue.toString());
			} catch (Exception ex) {
				System.out.println(ex.getMessage());
				continue;
			}

			Point3D point = new Point3D();
			StatCod stat = statMap.get(v01000);
			if (stat == null)
				continue;

			point.setId(v01000);
			point.setLon(statMap.get(v01000).getV06001().doubleValue());
			point.setLat(statMap.get(v01000).getV05001().doubleValue());
			point.setData(value);

			pointList.add(point);
		}

		// 按站点进行分组并求平均
		Map<Integer, Double> pointsMap = pointList.parallelStream()
				.collect(Collectors.groupingBy(Point3D::getId, Collectors.averagingDouble(Point3D::getData)));
		pointList.clear();
		
		// 将多天平均值按站点组装返回
		pointsMap.forEach((k, v) -> {
			System.out.println("key:value = " + k + ":" + v);
			Point3D point = new Point3D();
			StatCod stat = statMap.get(k);

			point.setId(k);
			point.setLon(stat.getV06001().doubleValue());
			point.setLat(stat.getV05001().doubleValue());
			point.setData(v);

			pointList.add(point);
		});

		return pointList;
	}

	private String getRasterFile(AreaCod area) {
		int areaCode = area.getcCode();
		AreaLevelEnum areaType = AreaLevelEnum.values()[area.getvLevel()];

		// 获取区域矢量文件
		String shpFileName = this.getShpResource(areaType);
		String attriWhere = String.format("GEO_CODE='%s'", areaCode);
		GridExtent ext = OGRHelper.getInstance().getExtent(shpFileName, attriWhere);

		// 获取插值区域的栅格文件
		String rasterFileName = null;
		String cityRasterFileName = this.getRasterResource(areaType.toString());

		try {
			rasterFileName = this.getRasterResource(String.valueOf(areaCode));
		} catch (RuntimeException ex) {
			// 未查找到区域栅格资源则从总区域中切割出一份保存
			File cityRasterFile = new File(cityRasterFileName);
			File rasterFile = new File(cityRasterFile.getParent(), String.valueOf(areaCode) + ".dat");
			rasterFileName = rasterFile.getAbsolutePath();

			if (!rasterFile.exists()) {
				GDALHelper.getInstance().Translate(cityRasterFileName, rasterFileName, ext, RasterFormat.ENVI);
				List<Point3D> areaPoints = GDALHelper.getInstance().readFile(rasterFileName, 1);
				GridExtent newExt = GDALHelper.getInstance().getGridExtent(rasterFileName);

				for (int i = 0; i < areaPoints.size(); i++) {
					if (areaPoints.get(i).getData() != areaCode)
						areaPoints.get(i).setData(-999);
				}

				ByteBuffer nioBuffer = GDALHelper.getInstance().ToGridByteBuffer(newExt, areaPoints);
				GDALHelper.getInstance().WriteRaster(RasterFormat.ENVI, newExt, nioBuffer, rasterFileName, false);
			}
		}

		return rasterFileName;
	}

	/**
	 * 获取区域矢量数据
	 *
	 * @param areaType
	 *            区域级别
	 * @return
	 */
	private String getShpResource(AreaLevelEnum areaType) {
		// 查找矢量文件
		String findName = "datas/" + areaType.toString() + ".shp";
		return SpringHelper.getReousrce(findName);
	}

	private String getRasterResource(String areaCode) {
		// 查找栅格文件
		String findName = "datas/" + areaCode + ".dat";
		return SpringHelper.getReousrce(findName);
	}

	private Map<String, Field> getFields(Class<?> clazz) {
		Map<String, Field> fields = new HashMap<String, Field>();
		while (clazz != null) {
			for (Field field : clazz.getDeclaredFields()) {
				if (!fields.containsKey(field.getName())) {
					field.setAccessible(true);
					fields.put(field.getName(), field);
				}
			}

			clazz = clazz.getSuperclass();
		}

		return fields;
	}

	private FileSystemResource getContent(Object... p) {
		if (p == null || p.length < 1 || !(p[0] instanceof File))
			throw new ResourceException(ErrorCodeEnum.ERROR_NULLPARAMS_RESOURCE, "未指定产品内容，参数为空！");

		File f = (File) p[0];
		if (!f.exists()) {
			throw new ResourceException(ErrorCodeEnum.ERROR_NOTFOUND_RESOURCE, "指定产品不存在！");
		}

		return new FileSystemResource(f);
	}
}