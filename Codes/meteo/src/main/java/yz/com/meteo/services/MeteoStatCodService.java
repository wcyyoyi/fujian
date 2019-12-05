package yz.com.meteo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import yz.com.core.exception.ServiceException;
import yz.com.meteo.resources.database.MeteoStatCodResource;

@Api(tags = "站点服务数据接口（业务）")
@RequestMapping(value = "/meteostat")
@RestController
public class MeteoStatCodService {

	@Autowired
	MeteoStatCodResource meteoStatCodRes;

	@ApiOperation(value = "根据作物名获取站点列表")
	@RequestMapping(value = "/getByCropName", method = RequestMethod.GET)
	public Object listByCropName(@RequestParam String cropName) throws ServiceException {
		return meteoStatCodRes.getByCropName(cropName);
	}
}
