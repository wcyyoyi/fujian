package yz.com.meteo.enums;

public enum GridAlgorithm {
	/**
	 * Inverse distance to a power
	 */
	InverseDistanceToAPower("invdist"),
	/**
	 * Moving Average
	 */
	MovingAverage("average"),	
	/**
	 * Nearest Neighbor
	 */
	NearestNeighbor("nearest"),
	/**
	 * Minimum Value (Data Metric)
	 */
	MetricMinimum("minimum"),
	/**
	 * Maximum Value (Data Metric)
	 */
	MetricMaximum("maximum"),
	/**
	 * Data Range (Data Metric)
	 */
	MetricRange("range"),
	/**
	 * Number of Points (Data Metric)
	 */
	MetricCount("count"),
	/**
	 * Average Distance (Data Metric)
	 */
	MetricAverageDistance("average_distance"),
	/**
	 * Average Distance Between Data Points (Data Metric)
	 */
	MetricAverageDistancePts("average_distance_pts"),
	/**
	 * Linear interpolation (from Delaunay triangulation. Since GDAL 2.1-name is not sure
	 */
	Linear("linear"),
	/**
	 * Inverse distance to a power with nearest neighbor search for max points-name is not sure
	 */
	InverseDistanceToAPowerNearestNeighbor("inverse");
	
	private String name;

	private GridAlgorithm(String name) {
		this.setName(name);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
