package yz.com.meteo.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import yz.com.bean.znq.AreaCod;
import yz.com.bean.znq.MangCropStatCod;
import yz.com.bean.znq.StatCod;
import yz.com.remote.services.api.IAreaCodService;
import yz.com.remote.services.api.IStatCodService;
import yz.com.resource.services.BaseService;
import yz.com.resources.database.MangCropStatCodResource;
import yz.com.services.CacheService;

@Api(tags = "作物站点服务数据接口")
@RequestMapping(value = "/mang/cropstat")
@RestController
public class MangCropStatCodService extends BaseService<MangCropStatCod, Integer> {

	@Autowired
	MangCropStatCodResource mangCropStatCodRes;
	@Autowired
	IStatCodService statCodService;
	@Autowired
	IAreaCodService areaCodService;

	@PostConstruct
	public void init() {
		super.init(mangCropStatCodRes);
	}

	@SuppressWarnings("unchecked")
	@ApiOperation(value = "根据区域代码获取作物信息")
	@RequestMapping(value = "/getByCCode", method = RequestMethod.GET)
	public Object getCropsByArea(@RequestParam int cCode) {
		List<MangCropStatCod> list = new ArrayList<MangCropStatCod>();

		if (CacheService.getInstance().hasKey("getByCCode_" + cCode)) {
			list = (List<MangCropStatCod>) CacheService.getInstance().getByKey("getByCCode_" + cCode);
		} else {
			List<Integer> statNumList = new ArrayList<Integer>();
			AreaCod areaCod = areaCodService.detail(cCode);
			List<StatCod> statList = statCodService.getByCCdode(cCode, areaCod.getvLevel());

			for (StatCod statCod : statList) {
				statNumList.add(statCod.getV01000());
			}

			if (statNumList.size() > 0) {
				Map<String, Object> params = new HashMap<String, Object>();
				params.put("v01000", statNumList.toArray());
				list = mangCropStatCodRes.getByCondition(params);
				CacheService.getInstance().setCache("getByCCode_" + cCode, list);
			}
		}

		return new ResponseEntity<List<MangCropStatCod>>(list, HttpStatus.OK);
	}

	@ApiOperation(value = "根据站号获取作物")
	@ApiImplicitParam(name = "statNums", value = "用','分隔的站号字符串")
	@RequestMapping(value = "/getByStatNums", method = RequestMethod.POST)
	public Object getCropsByStatNums(@RequestBody String statNums) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("v01000", statNums.split(","));
		return new ResponseEntity<List<MangCropStatCod>>(mangCropStatCodRes.getByCondition(params), HttpStatus.OK);
	}

	@RequestMapping(value = "/deleteCache", method = RequestMethod.DELETE)
	@ApiOperation(value = "删除全部缓存")
	public Object deleteMicCache() throws Exception {
		CacheService.getInstance().clearAll();
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}

	@ApiOperation(value = "批量插入数据")
	@ApiImplicitParam(name = "list", value = "作物站点集合")
	@RequestMapping(value = "/batch", method = RequestMethod.POST)
	public Object insertByBatch(@RequestBody List<MangCropStatCod> list) {
		return new ResponseEntity<Integer>(mangCropStatCodRes.insertByBatch(list), HttpStatus.OK);
	}

	@ApiOperation(value = "根据作物名称和站点删除")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "cropname", value = "作物名称"),
		@ApiImplicitParam(name = "v01000s", value = "站号集合")
	})
	@RequestMapping(value = "/deleteByCropnameAndV01000", method = RequestMethod.POST)
	public Object deleteByCropnameAndV01000(@RequestParam String cropname, @RequestBody List<Integer> v01000s) {
		return new ResponseEntity<Integer>(mangCropStatCodRes.deleteByCropnameAndV01000(cropname, v01000s),
				HttpStatus.OK);
	}
}
