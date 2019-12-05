package yz.com.mos.models;

import java.util.List;

public class MosData {
	private double v01000;

	private int v04001;

	private int v04002;

	private int v04003;

	private int v04004;

	private int timelimit;

	private double v05001;

	private double v06001;

	private double v07001;

	private double v12001000;

	private double v13003000;

	private double v11001000;

	private double v11002000;

	private double v10004000;

	private double v13019000;

	private double v20010000;

	private double v20051000;

	private double v20063000;

	private double v20001000;

	private double v12016;

	private double v12017;

	private double v13006;

	private double v13007;

	private double v13019024;

	private double v13019012;

	private double v20010012;

	private double v20051012;

	private double v20063012;

	private double v11001012;

	private double v11002012;

	private double v11002001;

	private double v12001;

	private double v20051;

	private double v20010;

	private String vdate;

	public MosData(MosFileHeader MosFileHeader, MosDataHeader MosDataHeader, List<String> data) {

		this.v01000 = MosDataHeader.getV01000();

		this.v04001 = MosFileHeader.getV04001();

		this.v04002 = MosFileHeader.getV04002();

		this.v04003 = MosFileHeader.getV04003();

		this.v04004 = MosFileHeader.getV04004();

		this.timelimit = Integer.parseInt(data.get(0));

		this.v05001 = MosDataHeader.getV05001();

		this.v06001 = MosDataHeader.getV06001();

		this.v07001 = MosDataHeader.getV07001();

		this.v12001000 = Double.parseDouble(data.get(1));

		this.v13003000 = Double.parseDouble(data.get(2));

		this.v11001000 = Double.parseDouble(data.get(3));

		this.v11002000 = Double.parseDouble(data.get(4));

		this.v10004000 = Double.parseDouble(data.get(5));

		this.v13019000 = Double.parseDouble(data.get(6));

		this.v20010000 = Double.parseDouble(data.get(7));

		this.v20051000 = Double.parseDouble(data.get(8));

		this.v20063000 = Double.parseDouble(data.get(9));

		this.v20001000 = Double.parseDouble(data.get(10));

		this.v12016 = Double.parseDouble(data.get(11));

		this.v12017 = Double.parseDouble(data.get(12));

		this.v13006 = Double.parseDouble(data.get(13));

		this.v13007 = Double.parseDouble(data.get(14));

		this.v13019024 = Double.parseDouble(data.get(15));

		this.v13019012 = Double.parseDouble(data.get(16));

		this.v20010012 = Double.parseDouble(data.get(17));

		this.v20051012 = Double.parseDouble(data.get(18));

		this.v20063012 = Double.parseDouble(data.get(19));

		this.v11001012 = Double.parseDouble(data.get(20));

		this.v11002012 = Double.parseDouble(data.get(21));

		// this.v11002001 = Double.parseDouble(data.get(0));
		//
		// this.v12001 = Double.parseDouble(data.get(0));
		//
		// this.v20051 = Double.parseDouble(data.get(0));
		//
		// this.v20010 = Double.parseDouble(data.get(0));
	}

	public String toInsertSql() {
		StringBuffer sb = new StringBuffer();
		sb.append("insert into T_R_NWFD_MOS_ELE ");
		sb.append(
				"(V01000, V04001, V04002, V04003, V04004, TIMELIMIT, V05001, V06001, V07001, V12001_000, V13003_000, V11001_000, V11002_000,"
						+ " V10004_000, V13019_000, V20010_000, V20051_000, V20063_000, V20001_000, V12016, V12017, V13006, V13007, V13019_024,"
						+ " V13019_012, V20010_012, V20051_012, V20063_012, V11001_012, V11002_012, VDATE) values(");
		sb.append(this.v01000 + ",");
		sb.append(this.v04001 + ",");
		sb.append(this.v04002 + ",");
		sb.append(this.v04003 + ",");
		sb.append(this.v04004 + ",");
		sb.append(this.timelimit + ",");
		sb.append(this.v05001 + ",");
		sb.append(this.v06001 + ",");
		sb.append(this.v07001 + ",");
		sb.append((this.v12001000 == 999.9 ? null : this.v12001000) + ",");
		sb.append((this.v13003000 == 999.9 ? null : this.v13003000) + ",");
		sb.append((this.v11001000 == 999.9 ? null : this.v11001000) + ",");
		sb.append((this.v11002000 == 999.9 ? null : this.v11002000) + ",");
		sb.append((this.v10004000 == 999.9 ? null : this.v10004000) + ",");
		sb.append((this.v13019000 == 999.9 ? null : this.v13019000) + ",");
		sb.append((this.v20010000 == 999.9 ? null : this.v20010000) + ",");
		sb.append((this.v20051000 == 999.9 ? null : this.v20051000) + ",");
		sb.append((this.v20063000 == 999.9 ? null : this.v20063000) + ",");
		sb.append((this.v20001000 == 999.9 ? null : this.v20001000) + ",");
		sb.append((this.v12016 == 999.9 ? null : this.v12016) + ",");
		sb.append((this.v12017 == 999.9 ? null : this.v12017) + ",");
		sb.append((this.v13006 == 999.9 ? null : this.v13006) + ",");
		sb.append((this.v13007 == 999.9 ? null : this.v13007) + ",");
		sb.append((this.v13019024 == 999.9 ? null : this.v13019024) + ",");
		sb.append((this.v13019012 == 999.9 ? null : this.v13019012) + ",");
		sb.append((this.v20010012 == 999.9 ? null : this.v20010012) + ",");
		sb.append((this.v20051012 == 999.9 ? null : this.v20051012) + ",");
		sb.append((this.v20063012 == 999.9 ? null : this.v20063012) + ",");
		sb.append((this.v11001012 == 999.9 ? null : this.v11001012) + ",");
		sb.append((this.v11002012 == 999.9 ? null : this.v11002012) + ",");
		sb.append("'" + this.vdate + "');");
		return sb.toString();
	}

	public double getV01000() {
		return v01000;
	}

	public void setV01000(double v01000) {
		this.v01000 = v01000;
	}

	public int getV04001() {
		return v04001;
	}

	public void setV04001(int v04001) {
		this.v04001 = v04001;
	}

	public int getV04002() {
		return v04002;
	}

	public void setV04002(int v04002) {
		this.v04002 = v04002;
	}

	public int getV04003() {
		return v04003;
	}

	public void setV04003(int v04003) {
		this.v04003 = v04003;
	}

	public int getV04004() {
		return v04004;
	}

	public void setV04004(int v04004) {
		this.v04004 = v04004;
	}

	public int getTimelimit() {
		return timelimit;
	}

	public void setTimelimit(int timelimit) {
		this.timelimit = timelimit;
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

	public double getV12001000() {
		return v12001000;
	}

	public void setV12001000(double v12001000) {
		this.v12001000 = v12001000;
	}

	public double getV13003000() {
		return v13003000;
	}

	public void setV13003000(double v13003000) {
		this.v13003000 = v13003000;
	}

	public double getV11001000() {
		return v11001000;
	}

	public void setV11001000(double v11001000) {
		this.v11001000 = v11001000;
	}

	public double getV11002000() {
		return v11002000;
	}

	public void setV11002000(double v11002000) {
		this.v11002000 = v11002000;
	}

	public double getV10004000() {
		return v10004000;
	}

	public void setV10004000(double v10004000) {
		this.v10004000 = v10004000;
	}

	public double getV13019000() {
		return v13019000;
	}

	public void setV13019000(double v13019000) {
		this.v13019000 = v13019000;
	}

	public double getV20010000() {
		return v20010000;
	}

	public void setV20010000(double v20010000) {
		this.v20010000 = v20010000;
	}

	public double getV20051000() {
		return v20051000;
	}

	public void setV20051000(double v20051000) {
		this.v20051000 = v20051000;
	}

	public double getV20063000() {
		return v20063000;
	}

	public void setV20063000(double v20063000) {
		this.v20063000 = v20063000;
	}

	public double getV20001000() {
		return v20001000;
	}

	public void setV20001000(double v20001000) {
		this.v20001000 = v20001000;
	}

	public double getV12016() {
		return v12016;
	}

	public void setV12016(double v12016) {
		this.v12016 = v12016;
	}

	public double getV12017() {
		return v12017;
	}

	public void setV12017(double v12017) {
		this.v12017 = v12017;
	}

	public double getV13006() {
		return v13006;
	}

	public void setV13006(double v13006) {
		this.v13006 = v13006;
	}

	public double getV13007() {
		return v13007;
	}

	public void setV13007(double v13007) {
		this.v13007 = v13007;
	}

	public double getV13019024() {
		return v13019024;
	}

	public void setV13019024(double v13019024) {
		this.v13019024 = v13019024;
	}

	public double getV13019012() {
		return v13019012;
	}

	public void setV13019012(double v13019012) {
		this.v13019012 = v13019012;
	}

	public double getV20010012() {
		return v20010012;
	}

	public void setV20010012(double v20010012) {
		this.v20010012 = v20010012;
	}

	public double getV20051012() {
		return v20051012;
	}

	public void setV20051012(double v20051012) {
		this.v20051012 = v20051012;
	}

	public double getV20063012() {
		return v20063012;
	}

	public void setV20063012(double v20063012) {
		this.v20063012 = v20063012;
	}

	public double getV11001012() {
		return v11001012;
	}

	public void setV11001012(double v11001012) {
		this.v11001012 = v11001012;
	}

	public double getV11002012() {
		return v11002012;
	}

	public void setV11002012(double v11002012) {
		this.v11002012 = v11002012;
	}

	public double getV11002001() {
		return v11002001;
	}

	public void setV11002001(double v11002001) {
		this.v11002001 = v11002001;
	}

	public double getV12001() {
		return v12001;
	}

	public void setV12001(double v12001) {
		this.v12001 = v12001;
	}

	public double getV20051() {
		return v20051;
	}

	public void setV20051(double v20051) {
		this.v20051 = v20051;
	}

	public double getV20010() {
		return v20010;
	}

	public void setV20010(double v20010) {
		this.v20010 = v20010;
	}

	public String getVdate() {
		return vdate;
	}

	public void setVdate(String vdate) {
		this.vdate = vdate;
	}

}
