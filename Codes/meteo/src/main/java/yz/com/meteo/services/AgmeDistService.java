package yz.com.meteo.services;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
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

import yz.com.bean.znq.AgmeDist;
import yz.com.core.ErrorCodeEnum;
import yz.com.core.IService;
import yz.com.core.exception.ServiceException;
import yz.com.core.rules.ProductRuleName;
import yz.com.core.utils.DateHelper;
import yz.com.remote.services.api.IProductService;
import yz.com.remote.services.api.utils.RomoteUtils;
import yz.com.resource.services.BaseService;
import yz.com.resources.database.AgmeDistResource;

@RequestMapping(value = "/dist/ele")
@RestController
public class AgmeDistService extends BaseService<AgmeDist, String> implements IService<AgmeDist, String> {
	@Autowired
	protected AgmeDistResource baseRecv;
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
		List<AgmeDist> agmeDistList = baseRecv.getByCondition(params);

		if (agmeDistList == null) {
			throw new ServiceException(ErrorCodeEnum.ERROR_NODATA_RESOURCE, "条件查询失败！");
		}

		return new ResponseEntity<List<AgmeDist>>(agmeDistList, HttpStatus.OK);
	}

	@RequestMapping(value = "/update/{id}/Photo", method = RequestMethod.GET)
	public Object updatePhoto(@RequestBody String names, @PathVariable int id) throws ServiceException {

		AgmeDist agmeDist = new AgmeDist();
		agmeDist.setId(id);
		agmeDist.setcPhotoId(names);
		baseRecv.update(agmeDist);
		return new ResponseEntity<Boolean>(baseRecv.update(agmeDist), HttpStatus.OK);
	}

	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public Object upload(@RequestParam int id, @RequestParam String cAreaCode, @RequestParam String cDistCode,
			@RequestParam Long time, final HttpServletRequest httpRequest) throws Exception {
		MultipartFile file = ((MultipartHttpServletRequest) httpRequest).getFile("file");
		
		if (file.isEmpty()) {
			throw new ServiceException(ErrorCodeEnum.ERROR_UPLOAD_SERVICE, file.getName() + "文件不存在！");
		}

		String filename = ProductRuleName.defaultName(cAreaCode,
				DateHelper.date2String("yyyyMMddHHmmss", new Date(time)), "ADRM", cDistCode, "dis");
		InputStream is = new ByteArrayInputStream(file.getBytes());
		MultipartFile mfile = RomoteUtils.coverMultipartStream(filename, is);
		prodServ.upload(filename, mfile);

		return new ResponseEntity<String>(filename, HttpStatus.OK);
	}

}
