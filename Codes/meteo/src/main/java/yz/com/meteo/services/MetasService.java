package yz.com.meteo.services;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import yz.com.core.enums.DataTypeEnum;
import yz.com.meteo.enums.BookMarkTypeEnum;
import yz.com.meteo.enums.SystemCatalogEnum;

@Api(tags = "元数据接口")
@RequestMapping(value = "/meteometas")
@RestController
public class MetasService {

	@RequestMapping(value = "/enum/type", method = RequestMethod.GET)
	@ApiOperation(value = "获取类型枚举")
	public Object getMonitorTypeEnum() throws Exception {
		return new ResponseEntity<String>(DataTypeEnum.toJson(), this.responseHeaders(), HttpStatus.OK);
	}

	@RequestMapping(value = "/enum/systemCatalogLevel", method = RequestMethod.GET)
	@ApiOperation(value = "获取系统目录等级枚举")
	public Object getSystemCatalogEnum() throws Exception {
		return new ResponseEntity<String>(SystemCatalogEnum.toJson(), this.responseHeaders(), HttpStatus.OK);
	}

	@RequestMapping(value = "/enum/bookMarkType", method = RequestMethod.GET)
	@ApiOperation(value = "获取书签类型枚举")
	public Object getBookMarkTypeEnum() throws Exception {
		return new ResponseEntity<String>(BookMarkTypeEnum.toJson(), this.responseHeaders(), HttpStatus.OK);
	}

//	@RequestMapping(value = "/enum/bookMarkWordType", method = RequestMethod.GET)
//	@ApiOperation(value = "获取书签文字类类型枚举")
//	public Object getBookMarkWordTypeEnum() throws Exception {
//		return new ResponseEntity<String>(BookMarkWordTypeEnum.toJson(), this.responseHeaders(), HttpStatus.OK);
//	}

	private HttpHeaders responseHeaders() {
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type", "application/json;charset=UTF-8");
		return responseHeaders;
	}
}
