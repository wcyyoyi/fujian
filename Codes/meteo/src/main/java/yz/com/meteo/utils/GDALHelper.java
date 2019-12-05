package yz.com.meteo.utils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.nio.ByteBuffer;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import org.gdal.gdal.Band;
import org.gdal.gdal.Dataset;
import org.gdal.gdal.Driver;
import org.gdal.gdal.TranslateOptions;
import org.gdal.gdal.gdal;
import org.gdal.gdalconst.gdalconstConstants;

import yz.com.core.models.gdal.GeoTransform;
import yz.com.core.models.gdal.GridExtent;
import yz.com.core.models.gdal.Point3D;
import yz.com.meteo.enums.GridAlgorithm;
import yz.com.meteo.enums.RasterFormat;

public class GDALHelper {

	private volatile static GDALHelper instance;
	private DecimalFormat df = new DecimalFormat("#");

	private GDALHelper() {
		gdal.AllRegister();
	}

	public void destroy() {
		gdal.GDALDestroyDriverManager();
	}

	public static GDALHelper getInstance() {
		if (instance != null)
			return instance;

		synchronized (GDALHelper.class) {
			// 二次检查
			if (instance == null)
				instance = new GDALHelper();
		}
		
		return instance;
	}

	/**
	 * 读取栅格文件中第一波段指定点的值
	 * 
	 * @param fileName
	 *            文件名（绝对路径）
	 * @param lon
	 *            经度
	 * @param lat
	 *            纬度
	 * @return
	 */
	public float readFile(String fileName, double lon, double lat) {
		return readFile(fileName, 1, lon, lat);
	}

	/**
	 * 读取栅格文件指定波段的数据集合
	 * 
	 * @param filename
	 *            文件名（绝对路径）
	 * @param nband
	 *            波段号（从1开始）
	 * @return
	 */
	public List<Point3D> readFile(String filename, int nband) {
		Dataset dataset = getDataset(filename);
		GeoTransform geoInfo = getGeoTransform(dataset);

		Band band = dataset.GetRasterBand(nband);// 第n层
		float[][] floatArray = new float[dataset.getRasterYSize()][dataset.getRasterXSize()];

		// band.ReadRaster(xNum, yNum, 1, 1, floatArray);
		for (int i = 0; i < dataset.getRasterYSize(); i++) {
			band.ReadRaster(0, i, dataset.getRasterXSize(), 1, floatArray[i]);
		}

		List<Point3D> pointList = new ArrayList<Point3D>();
		for (int i = 0; i < floatArray.length; i++) {
			double lat = geoInfo.getTop() - i * geoInfo.getyCellSIze();

			for (int j = 0; j < floatArray[i].length; j++) {
				Point3D point = new Point3D();
				point.setLon(geoInfo.getLeft() + j * geoInfo.getxCellSize());
				point.setLat(lat);
				point.setData(floatArray[i][j]);

				pointList.add(point);
			}
		}

		dataset.delete();
		return pointList;
	}

	/**
	 * 读取栅格文件中指定波段指定点的值
	 * 
	 * @param filename
	 *            文件名（绝对路径）
	 * @param nband
	 *            波段号（从1开始）
	 * @param lon
	 *            经度
	 * @param lat
	 *            纬度
	 * @return float
	 */
	public float readFile(String filename, int nband, double lon, double lat) {
		Dataset dataset = getDataset(filename);
		GeoTransform geoInfo = getGeoTransform(dataset);

		// 计算行列号
		int yNum = Integer.valueOf(df.format(((geoInfo.getTop() - lat) / geoInfo.getyCellSIze())));
		int xNum = Integer.valueOf(df.format(((lon - geoInfo.getLeft()) / geoInfo.getxCellSize())));

		Band band = dataset.GetRasterBand(nband);
		float[] floatArray = new float[1];

		band.ReadRaster(xNum, yNum, 1, 1, floatArray);

		return floatArray[0];
	}

	public GeoTransform getGeoTransform(String filename) {
		Dataset ds = getDataset(filename);
		GeoTransform geoTrans = getGeoTransform(ds);
		ds.delete();

		return geoTrans;
	}

	public GridExtent getGridExtent(String filename) {
		Dataset ds = getDataset(filename);
		GeoTransform geoTrans = getGeoTransform(ds);

		GridExtent ext = new GridExtent();
		ext.setResoultion(geoTrans.getxCellSize());
		ext.setxMin(geoTrans.getLeft());
		ext.setxMax(geoTrans.getRight());
		ext.setyMin(geoTrans.getBottom());
		ext.setyMax(geoTrans.getTop());

		ds.delete();
		return ext;
	}

	/**
	 * 获取数据头中的地理信息
	 * 
	 * @param dataset
	 *            数据头
	 * @return GeoTransform
	 */
	private GeoTransform getGeoTransform(Dataset dataset) {
		// 读取地理信息
		double[] adfGeoTransform = new double[6];
		dataset.GetGeoTransform(adfGeoTransform);

		GeoTransform geoInfo = new GeoTransform();
		geoInfo.setTop(adfGeoTransform[3]);
		geoInfo.setLeft(adfGeoTransform[0]);
		geoInfo.setRight(adfGeoTransform[2]);
		geoInfo.setBottom(adfGeoTransform[4]);

		geoInfo.setxCellSize(Math.abs(adfGeoTransform[1]));
		geoInfo.setyCellSIze(Math.abs(adfGeoTransform[5]));

		if (geoInfo.getRight() == 0.0 && geoInfo.getBottom() == 0.0) {
			geoInfo.setRight(geoInfo.getLeft() + dataset.getRasterXSize() * geoInfo.getxCellSize());
			geoInfo.setBottom(geoInfo.getTop() - dataset.getRasterYSize() * geoInfo.getyCellSIze());
		}

		return geoInfo;
	}

	/**
	 * 获取指定文件数据头
	 * 
	 * @param filename
	 *            文件名
	 * @return 数据头
	 */
	private Dataset getDataset(String filename) {
		Dataset dataset = gdal.Open(filename, gdalconstConstants.GA_ReadOnly);
		if (dataset == null) {
			String errorMsg = "GDALOpen failed - " + gdal.GetLastErrorNo();
			errorMsg += "! Detail: " + gdal.GetLastErrorMsg();

			throw new NullPointerException(errorMsg);
		}

		System.out.println("Driver: " + dataset.GetDriver().getShortName() + "/" + dataset.GetDriver().getLongName());
		// 读取影像信息
		System.out.println("Size is " + dataset.getRasterXSize() + ", " + dataset.getRasterYSize() + ", "
				+ dataset.getRasterCount());

		return dataset;
	}

	public void WriteRaster(RasterFormat format, GridExtent extent, ByteBuffer nioBuffer, String fileName,
			boolean isTrans) {
		// 注册驱动
		Driver driver = gdal.GetDriverByName(format.toString());
		int type = gdalconstConstants.GDT_Float64;

		// 范围
		int xSize = Integer.valueOf(df.format(((extent.getxMax() - extent.getxMin()) / extent.getResoultion())));
		int ySize = Integer.valueOf(df.format(((extent.getyMax() - extent.getyMin()) / extent.getResoultion())));

		// File rasterFile = new File(fileName);
		// if (rasterFile.exists())
		// rasterFile.delete();

		// 创建数据源
		Dataset dstDS = driver.Create(fileName, xSize, ySize, 1, type);
		// 设置六参数
		double[] trans = { extent.getxMin(), extent.getResoultion(), 0, extent.getyMax(), 0, -extent.getResoultion() };
		dstDS.SetGeoTransform(trans);

		// 设置投影
		String EPSG4326WKT = "GEOGCS[\"WGS84 datum, Latitude-Longitude; Degrees\", DATUM[\"WGS_1984\", SPHEROID[\"World Geodetic System of 1984, GEM 10C\",6378137,298.257223563, AUTHORITY[\"EPSG\",\"7030\"]], AUTHORITY[\"EPSG\",\"6326\"]], PRIMEM[\"Greenwich\",0], UNIT[\"degree\",0.0174532925199433], AUTHORITY[\"EPSG\",\"4326\"]]";
		dstDS.SetProjection(EPSG4326WKT);

		ByteBuffer newBuffer = null;
		if (isTrans)
			newBuffer = transformBuffer(nioBuffer, type, xSize, ySize);
		else
			newBuffer = nioBuffer;

		// 获取第一个波段写入数据
		Band band = dstDS.GetRasterBand(1);
		band.SetNoDataValue(-999);

		int rc = band.WriteRaster_Direct(0, 0, xSize, ySize, xSize, ySize, type, newBuffer);
		dstDS.delete();

		if (rc != 0)
			throw new RuntimeException("Write raster failture! ErrorCode: " + rc);
	}

	public ByteBuffer GridCreate(GridAlgorithm gridType, GridExtent extent, List<Point3D> egPoints) {
		if (egPoints == null || egPoints.size() < 1)
			throw new NullPointerException("Not enough point to work!");

		double[][] data = egPoints.stream().map(p -> {
			return new double[] { p.getLon(), p.getLat(), p.getData() };
		}).toArray(double[][]::new);

		// 计算x,y轴各自长度
		int xSize = Integer.valueOf(df.format(((extent.getxMax() - extent.getxMin()) / extent.getResoultion())));
		int ySize = Integer.valueOf(df.format(((extent.getyMax() - extent.getyMin()) / extent.getResoultion())));

		// 插值的数据类型
		int type = gdalconstConstants.GDT_Float64;
		// 所需计算缓冲区大小，8位一字节
		int bufferSize = xSize * ySize * gdal.GetDataTypeSize(type) / 8;
		ByteBuffer nioBuffer = ByteBuffer.allocateDirect(bufferSize);

		int rc = gdal.GridCreate(
				"invdist:power=2.0:smoothing=0.01:radius1=1.0:radius2=1.0:angle=0.0:max_points=0:min_points=0:nodata=-999",
				data, extent.getxMin(), extent.getxMax(), extent.getyMin(), extent.getyMax(), xSize, ySize, type,
				nioBuffer);

		if (rc != 0)
			throw new RuntimeException("Call GDAL.GridCreate failtrue! ErrorCode: " + rc);

		return nioBuffer;
	}

	public void Translate(String iFilename, String oFilename, GridExtent extent, RasterFormat format) {
		Vector<String> extVector = new Vector<String>();
		extVector.add("-projwin");
		extVector.add(String.valueOf(extent.getxMin()));
		extVector.add(String.valueOf(extent.getyMax()));
		extVector.add(String.valueOf(extent.getxMax()));
		extVector.add(String.valueOf(extent.getyMin()));

		extVector.add("-of");
		extVector.add(format.toString());

		TranslateOptions option = new TranslateOptions(extVector);
		Dataset dstDS = this.getDataset(iFilename);

		Dataset newDs = gdal.Translate(oFilename, dstDS, option);

		dstDS.delete();
		newDs.delete();
	}

	/**
	 * @param pResoultion
	 * @param xMin
	 * @param yMax
	 * @param xSize
	 * @param nioBuffer
	 * @return
	 */
	public List<Point3D> ToGridPoints(GridExtent extent, ByteBuffer nioBuffer) {
		int pos = 0;
		int count = 0;
		int nRow = 0;
		int nCol = 0;

		double xOff = extent.getxMin();
		double yOff = extent.getyMax();
		double pResoultion = extent.getResoultion();
		int xSize = Integer.valueOf(df.format(((extent.getxMax() - extent.getxMin()) / extent.getResoultion())));

		List<Point3D> pointList = new ArrayList<Point3D>();

		while (pos < nioBuffer.limit()) {
			// double value = nioBuffer.getDouble();
			// 计算当前行和当前列
			nRow = count / xSize;
			nCol = count - (nRow * xSize);

			// 计算x和y方向的偏移量
			xOff = extent.getxMin() + nCol * pResoultion;
			yOff = extent.getyMin() + nRow * pResoultion;

			// byte转double
			byte[] dst = new byte[8];
			nioBuffer.get(dst, 0, 8);
			double dval = bytes2Double(dst);

			Point3D point = new Point3D();
			point.setLon(xOff);
			point.setLat(yOff);
			point.setData(dval);

			pointList.add(point);

			pos += 8;
			count++;
		}

		return pointList;
	}

	public ByteBuffer ToGridByteBuffer(GridExtent extent, List<Point3D> pointList) {
		// 默认double类型
		int type = gdalconstConstants.GDT_Float64;

		// 范围
		int xSize = Integer.valueOf(df.format((extent.getxMax() - extent.getxMin()) / extent.getResoultion()));
		int ySize = Integer.valueOf(df.format((extent.getyMax() - extent.getyMin()) / extent.getResoultion()));

		// 所需计算缓冲区大小，8位一字节
		int bufferSize = xSize * ySize * gdal.GetDataTypeSize(type) / 8;
		ByteBuffer nioBuffer = ByteBuffer.allocateDirect(bufferSize);

		for (int i = 0; i < pointList.size(); i++) {
			double pValue = pointList.get(i).getData();
			byte[] pBytes = double2Bytes(pValue);

			nioBuffer.put(pBytes, 0, 8);
		}

		return nioBuffer;
	}

	public void WriteStringToFile(String filePath, String content) {
		try {
			FileWriter fw = new FileWriter(filePath, true);
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(content);
			bw.close();
			fw.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 内存数据行倒置
	 * 
	 * @param nioBuffer
	 *            grid 数据缓冲区
	 * @param type
	 *            存储数据类型
	 * @param xSize
	 *            x轴长度
	 * @param ySize
	 *            y轴长度
	 * @return 倒置后数据缓冲区
	 */
	private ByteBuffer transformBuffer(ByteBuffer nioBuffer, int type, int xSize, int ySize) {
		int pos = 0;
		int bufferSize = xSize * ySize * gdal.GetDataTypeSize(type) / 8;
		int xBufferSize = xSize * gdal.GetDataTypeSize(type) / 8;

		ByteBuffer newBuffer = ByteBuffer.allocateDirect(bufferSize);
		// nioBuffer.flip();

		while (pos < nioBuffer.limit()) {
			byte[] buf = new byte[xBufferSize];
			int xpos = nioBuffer.limit() - pos - xBufferSize;

			nioBuffer.position(xpos);
			nioBuffer.get(buf, 0, xBufferSize);

			newBuffer.put(buf, 0, xBufferSize);
			pos += xBufferSize;
		}

		return newBuffer;
	}

	/**
	 * byte转double
	 * 
	 * @param arr
	 *            字节数组
	 * @return
	 */
	private double bytes2Double(byte[] arr) {
		long dvalue = 0;
		for (int i = 0; i < 8; i++) {
			dvalue |= ((long) (arr[i] & 0xff)) << (8 * i);
		}

		double dval = Double.longBitsToDouble(dvalue);
		return dval;
	}

	/**
	 * double转byte
	 * 
	 * @param d
	 *            数值
	 * @return
	 */
	private byte[] double2Bytes(double d) {
		long value = Double.doubleToRawLongBits(d);
		byte[] byteRet = new byte[8];

		for (int i = 0; i < 8; i++) {
			byteRet[i] = (byte) ((value >> 8 * i) & 0xff);
		}

		return byteRet;
	}

	public static void main(String[] args) {
		String fileName = "D:\\FTP\\map\\ArcGIS\\FJNew\\FJCityRaster.img";
		GridExtent ext = new GridExtent();
		ext.setxMin(118.378971971581);
		ext.setxMax(120.008971971581);
		ext.setyMin(25.3129450050211);
		ext.setyMax(26.6429450050211);

		GDALHelper.getInstance().Translate(fileName, "d:\\350100.img", ext, RasterFormat.ENVI);
		// Dataset ds = GDALHelper.getInstance().getDataset(fileName);
		// GDALHelper.getInstance().getGeoTransform(ds);
		// List<Point3D> pointList = GDALHelper.getInstance().readFile(fileName,
		// 1);
		// List<Point3D> pointList = new ArrayList<Point3D>();
		// Point3D point1 = new Point3D();
		// point1.setLon(114.55);
		// point1.setLat(32.3);
		// point1.setData(3);
		//
		// Point3D point2 = new Point3D();
		// point2.setLon(114.55);
		// point2.setLat(32.3);
		// point2.setData(4);
		//
		// Point3D point3 = new Point3D();
		// point3.setLon(115.95);
		// point3.setLat(34.45);
		// point3.setData(5);
		//
		// pointList.add(point1);
		// pointList.add(point2);
		// pointList.add(point3);
		//
		// // for (int i = 0; i < 10000; i++) {
		// // Point3D point = new Point3D();
		// // point.setLon(114.55);
		// // point.setLat(32.3);
		// // point.setData(3);
		// // pointList.add(point);
		// // }
		//
		// GridExtent ext = new GridExtent();
		// ext.setxMin(114.5);
		// ext.setxMax(116);
		// ext.setyMin(32.25);
		// ext.setyMax(34.5);
		// ext.setResoultion(0.05);
		//
		// ByteBuffer nioBuffer =
		// GDALHelper.getInstance().GridCreate(GridAlgorithm.InverseDistanceToAPower,
		// ext,
		// pointList);
		// // List<Point3D> pList = GDALHelper.getInstance().ToGridPoints(ext,
		// // nioBuffer);
		// GDALHelper.getInstance().WriteRaster(RasterFormat.ENVI, ext,
		// nioBuffer, "d:\\test.img");
	}

}
