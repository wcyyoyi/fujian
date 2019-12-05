package yz.com.meteo.enums;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public enum BookMarkTypeEnum {
	WORD(1), IMG(2), DATA(3), TABLE(4), DATE(5);

	private int code;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	private BookMarkTypeEnum(int code) {
		this.code = code;
	}

	public static BookMarkTypeEnum fromCode(int code) {
		for (BookMarkTypeEnum type : BookMarkTypeEnum.values()) {
			if (type.code == code) {
				return type;
			}
		}
		return WORD;
	}

	/**
	 * 将该枚举全部转化成json
	 * 
	 * @return
	 */
	public static String toJson() {
		JSONArray jsonArray = new JSONArray();

		JSONObject object1 = new JSONObject();
		object1.put("code", WORD.code);
		object1.put("desc", "文字类");
		jsonArray.add(object1);

		JSONObject object2 = new JSONObject();
		object2.put("code", IMG.code);
		object2.put("desc", "图片类");
		jsonArray.add(object2);

		JSONObject object3 = new JSONObject();
		object3.put("code", DATA.code);
		object3.put("desc", "数据类");
		jsonArray.add(object3);

		JSONObject object4 = new JSONObject();
		object4.put("code", TABLE.code);
		object4.put("desc", "表格类");
		jsonArray.add(object4);

		JSONObject object5 = new JSONObject();
		object5.put("code", DATE.code);
		object5.put("desc", "日期类");
		jsonArray.add(object5);
		return jsonArray.toString();
	}

}
