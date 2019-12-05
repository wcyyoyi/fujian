package yz.com.mos.models;

import java.util.List;

public class MosDataHeader {
	private int v01000;
	private double v05001;
	private double v06001;
	private double v07001;
	private int dataCount;
	private int eleCount;

	public MosDataHeader(List<String> data) {
		String statNum = data.get(0);
		if (statNum.matches(".*[a-zA-z].*")) {
			StringBuffer sbu = new StringBuffer();
			char[] chars = data.get(0).toCharArray();
			for (int i = 0; i < chars.length; i++) {
				if (chars[i] >= 'A' && chars[i] <= 'z') {
					sbu.append((int) chars[i]);
				} else {
					sbu.append(chars[i]);
				}
			}
			statNum = sbu.toString();
		}
		this.v01000 = Integer.parseInt(statNum);
		this.v05001 = Double.parseDouble(data.get(1));
		this.v06001 = Double.parseDouble(data.get(2));
		this.v07001 = Double.parseDouble(data.get(3));
		this.dataCount = Integer.parseInt(data.get(4));
		this.eleCount = Integer.parseInt(data.get(5));
	}

	public int getV01000() {
		return v01000;
	}

	public void setV01000(int v01000) {
		this.v01000 = v01000;
	}

	public double getV05001() {
		return v05001;
	}

	public void setV05001(double v05001) {
		this.v05001 = v05001;
	}

	public double getV06001() {
		return v06001;
	}

	public void setV06001(double v06001) {
		this.v06001 = v06001;
	}

	public double getV07001() {
		return v07001;
	}

	public void setV07001(double v07001) {
		this.v07001 = v07001;
	}

	public int getDataCount() {
		return dataCount;
	}

	public void setDataCount(int dataCount) {
		this.dataCount = dataCount;
	}

	public int getEleCount() {
		return eleCount;
	}

	public void setEleCount(int eleCount) {
		this.eleCount = eleCount;
	}

}
