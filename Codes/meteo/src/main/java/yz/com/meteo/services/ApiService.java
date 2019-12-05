package yz.com.meteo.services;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(value = "/test")
@RestController
public class ApiService {

	@RequestMapping(method = RequestMethod.GET)
	public Object test() throws Exception {
		return "";
	}

	public static Map<String, Object> getRequestParams(HttpServletRequest request) {
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
}
