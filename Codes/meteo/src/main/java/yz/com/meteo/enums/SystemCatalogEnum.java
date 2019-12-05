package yz.com.meteo.enums;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public enum SystemCatalogEnum {
	DEFAULT(-1, "默认"),
	PROVINCE(1, "省级"),
	CITY(2, "市级"),
	COUNTRY(3, "县级"),
	AREA(4, "区域");

	private int code;
	private String desc;

	private SystemCatalogEnum(int code, String desc) {
		this.code = code;
		this.desc = desc;
	}

	public static SystemCatalogEnum fromCode(int code) {
		for (SystemCatalogEnum type : SystemCatalogEnum.values()) {
			if (type.code == code) {
				return type;
			}
		}
		return DEFAULT;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}
	
	/**
	 * 将该枚举全部转化成json
	 * 
	 * @return
	 */
	public static String toJson() {
		JSONArray jsonArray = new JSONArray();
		for (SystemCatalogEnum e : SystemCatalogEnum.values()) {
			JSONObject object = new JSONObject();
			object.put("code", e.getCode());
			object.put("desc", e.getDesc());
			jsonArray.add(object);
		}
		return jsonArray.toString();
	}
}
