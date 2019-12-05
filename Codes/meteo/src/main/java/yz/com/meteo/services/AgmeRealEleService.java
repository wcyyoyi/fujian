package yz.com.meteo.services;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import yz.com.bean.znq.AgmeRealEle;
import yz.com.core.ErrorCodeEnum;
import yz.com.core.IService;
import yz.com.core.exception.ServiceException;
import yz.com.core.rules.ProductRuleName;
import yz.com.core.utils.DateHelper;
import yz.com.remote.services.api.IProductService;
import yz.com.remote.services.api.utils.RomoteUtils;
import yz.com.resource.services.BaseService;
import yz.com.resources.database.AgmeRealEleResource;

@RequestMapping(value = "/real/ele")
@RestController
public class AgmeRealEleService extends BaseService<AgmeRealEle, String> implements IService<AgmeRealEle, String> {
	@Autowired
	protected AgmeRealEleResource baseRecv;
	@Autowired
	private IProductService prodServ;

	@PostConstruct
	public void init() {
		super.init(baseRecv);
	}

	public Map<String, Object> getRequestParams(HttpServletRequest request) {
		Map<String, Object> params = new HashMap<String, Object>();
		if (null != request) {
			Set<?> paramsKey = request.getParameterMap().keySet();
			for (Object key : paramsKey) {
				String valueStr = request.getParameter(key.toString());
				params.put(key.toString(), valueStr);
			}
		}
		return params;
	}

	@RequestMapping(value = "/query", method = RequestMethod.GET)
	public Object listByFields(final HttpServletRequest httpRequest) throws ServiceException {
		Map<String, Object> params = getRequestParams(httpRequest);
		List<AgmeRealEle> agmeRealEleList = baseRecv.getByCondition(params);

		if (agmeRealEleList == null) {
			throw new ServiceException(ErrorCodeEnum.ERROR_NODATA_RESOURCE, "条件查询失败！");
		}

		return new ResponseEntity<List<AgmeRealEle>>(agmeRealEleList, HttpStatus.OK);
	}

	@RequestMapping(value = "/update/{id}/Photo", method = RequestMethod.GET)
	public Object updatePhoto(@RequestBody String names, @PathVariable int id) throws ServiceException {

		AgmeRealEle agmeRealEle = new AgmeRealEle();
		agmeRealEle.setId(id);
		agmeRealEle.setcPhotoId(names);
		baseRecv.update(agmeRealEle);
		return new ResponseEntity<Boolean>(baseRecv.update(agmeRealEle), HttpStatus.OK);
	}

	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public Object upload(@RequestParam int id, @RequestParam String cAreaCode, @RequestParam String cCropCode,
			@RequestParam Long time, final HttpServletRequest httpRequest) throws Exception {
		MultipartFile file = ((MultipartHttpServletRequest) httpRequest).getFile("file");

		if (file.isEmpty()) {
			throw new ServiceException(ErrorCodeEnum.ERROR_UPLOAD_SERVICE, file.getName() + "文件不存在！");
		}

		String filename = ProductRuleName.defaultName(cAreaCode,
				DateHelper.date2String("yyyyMMddHHmmss", new Date(time)), "REAL", cCropCode, "jpg");
		MultipartFile mfile = RomoteUtils.coverMultipartStream(filename, file.getInputStream());
		prodServ.upload(filename, mfile);

		return new ResponseEntity<String>(filename, HttpStatus.OK);
	}

}
