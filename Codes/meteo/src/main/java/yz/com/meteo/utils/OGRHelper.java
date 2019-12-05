package yz.com.meteo.utils;

import java.util.ArrayList;
import java.util.List;

import org.gdal.gdal.gdal;
import org.gdal.ogr.DataSource;
import org.gdal.ogr.Feature;
import org.gdal.ogr.Geometry;
import org.gdal.ogr.Layer;
import org.gdal.ogr.ogr;
import org.gdal.ogr.ogrConstants;

import yz.com.core.models.gdal.GridExtent;
import yz.com.core.models.gdal.Point3D;

public class OGRHelper {
	private volatile static OGRHelper instance;

	private OGRHelper() {
		// 注册所有的驱动
		ogr.RegisterAll();
		// 为了支持中文路径，请添加下面这句代码
		gdal.SetConfigOption("GDAL_FILENAME_IS_UTF8", "YES");
		// 为了使属性表字段支持中文，请添加下面这句
		gdal.SetConfigOption("SHAPE_ENCODING", "");
	}

	public void destroy() {

	}

	public static OGRHelper getInstance() {
		if (instance != null)
			return instance;
		
		synchronized (OGRHelper.class) {
			// 二次检查
			if (instance == null)
				instance = new OGRHelper();
		}
		
		return instance;
	}

	public GridExtent getExtent(String fileName, String srcWhere) {
		Geometry clipSrc = LoadGeometry(fileName, null, null, srcWhere);
		double[] env = new double[4];
		clipSrc.GetEnvelope(env);

		// 获取外接矩形
		GridExtent ext = new GridExtent();
		ext.setxMin(env[0]);
		ext.setxMax(env[1]);
		ext.setyMin(env[2]);
		ext.setyMax(env[3]);

		return ext;
	}

	public String ToGeoJson(List<Point3D> pointList) {
		if (pointList == null || pointList.size() == 0)
			throw new NullPointerException("No point in list! ");

		Geometry geo = new Geometry(ogr.wkbMultiPoint);

		pointList.forEach(p -> {
			Geometry pointGeo = new Geometry(ogr.wkbPoint);
			pointGeo.AddPoint(p.getLon(), p.getLat(), p.getData());

			geo.AddGeometry(pointGeo);
		});

		return geo.ExportToJson();
	}

	public List<Point3D> fliterByGeometry(List<Point3D> pointList, String fileName, String srcWhere) {
		Geometry clipSrc = LoadGeometry(fileName, null, null, srcWhere);
		List<Point3D> filterList = new ArrayList<Point3D>();

		Geometry pointsGeo = new Geometry(ogr.wkbMultiPoint);

		for (int i = 0; i < pointList.size(); i++) {
			Point3D p = pointList.get(i);

			Geometry pointGeo = new Geometry(ogr.wkbPoint);
			pointGeo.AddPoint(p.getLon(), p.getLat(), p.getData());

			pointsGeo.AddGeometry(pointGeo);

			// Geometry clipGeo = clipSrc.GetGeometryRef(0).GetBoundary();
			// String name = clipGeo.GetGeometryName();
			// 判断点是否在面上
			// if (!pointGeo.Within(clipSrc))
			// p.setData(-999);
			//
			// filterList.add(p);
		}

		Geometry filterGeo = clipSrc.Intersection(pointsGeo);
		List<String> keys = new ArrayList<String>();
		
		for (int i = 0; i < filterGeo.GetGeometryCount(); i++) {
			Geometry pointGeo = filterGeo.GetGeometryRef(i);
			
			Point3D p = new Point3D();
			p.setLon(pointGeo.GetX());
			p.setLat(pointGeo.GetY());
			p.setData(pointGeo.GetZ());
			
			filterList.add(p);
			
			String pKey = String.valueOf(p.getLon()) + "_" + String.valueOf(p.getLat());
			keys.add(pKey);
		}
		
		for(int i=0; i< pointList.size();i++){
			Point3D p = pointList.get(i);
			String pKey = String.valueOf(p.getLon()) + "_" + String.valueOf(p.getLat());
			
			if(!keys.contains(pKey))
				p.setData(-999);
		}
		
		return pointList;
	}

	/*
	 * LoadGeometry
	 * 
	 * Read geometries from the given dataset using specified filters and
	 * returns a collection of read geometries.
	 */
	private Geometry LoadGeometry(String srcDS, String srcSQL, String srcLyr, String srcWhere) {
		DataSource DS;
		Layer lyr;
		Feature feat;
		Geometry geom = null;

		DS = ogr.Open(srcDS, false);

		if (DS == null) {
			return null;
		}

		if (srcSQL != null) {
			lyr = DS.ExecuteSQL(srcSQL, null, null);
		} else if (srcLyr != null) {
			lyr = DS.GetLayerByName(srcLyr);
		} else {
			lyr = DS.GetLayer(0);
		}

		if (lyr == null) {
			System.err.println("Failed to identify source layer from datasource.");
			DS.delete();
			return null;
		}

		if (srcWhere != null) {
			lyr.SetAttributeFilter(srcWhere);
		}

		while ((feat = lyr.GetNextFeature()) != null) {

			Geometry srcGeom = feat.GetGeometryRef();

			if (srcGeom != null) {

				int srcType = srcGeom.GetGeometryType() & (~ogrConstants.wkb25DBit);

				if (geom == null) {

					geom = new Geometry(ogr.wkbMultiPolygon);
				}

				if (srcType == ogr.wkbPolygon) {

					geom.AddGeometry(srcGeom);
				} else if (srcType == ogr.wkbMultiPolygon) {

					int geomIndex = 0;
					int geomCount = srcGeom.GetGeometryCount();

					for (geomIndex = 0; geomIndex < geomCount; geomIndex++) {

						geom.AddGeometry(srcGeom.GetGeometryRef(geomIndex));
					}

				} else {

					System.err.println("FAILURE: Geometry not of polygon type.");

					if (srcSQL != null) {

						DS.ReleaseResultSet(lyr);
					}

					DS.delete();

					return null;
				}
			}
		}

		if (srcSQL != null) {

			DS.ReleaseResultSet(lyr);
		}

		DS.delete();

		return geom;
	}
}
