package yz.com.meteo.enums;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public enum BookMarkWordTypeEnum {
	NRTY(1, "内容提要"), ZS(2, "综述"), TQQS(3, "天气趋势"), NSJY(4, "农事建议"), OTHER(5, "其他");

	private int code;
	private String desc;

	private BookMarkWordTypeEnum(int code, String desc) {
		this.code = code;
		this.desc = desc;
	}

	public static BookMarkWordTypeEnum fromCode(int code) {
		for (BookMarkWordTypeEnum type : BookMarkWordTypeEnum.values()) {
			if (type.code == code) {
				return type;
			}
		}
		return NRTY;
	}

	/**
	 * 将该枚举全部转化成json
	 * 
	 * @return
	 */
	public static String toJson() {
		JSONArray jsonArray = new JSONArray();
		for (BookMarkWordTypeEnum e : BookMarkWordTypeEnum.values()) {
			JSONObject object = new JSONObject();
			object.put("code", e.getCode());
			object.put("desc", e.getDesc());
			jsonArray.add(object);
		}
		return jsonArray.toString();
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

}
