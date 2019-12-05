package yz.com.meteo.enums;

public enum AgmsInfoTempTypeEnum {
	TenDays("旬报", "TEND"), 
	Month("月报", "MONT"), 
	Week("周报", "WEEK"),
	Spring("春耕春播", "SPRS-PLO-SOW"),
	Summer("夏收夏种", "SUMS-HAR-SOW"),
	Autumn("秋收秋种", "AUTS-HAR-SOW");

	private String name;
	private String type;

	private AgmsInfoTempTypeEnum(String name, String type) {
		this.name = name;
		this.type = type;
	}

	public static String getNameByType(String type) {
		for (AgmsInfoTempTypeEnum a : AgmsInfoTempTypeEnum.values()) {
			if (a.type.equals(type)) {
				return a.name;
			}
		}
		return null;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
