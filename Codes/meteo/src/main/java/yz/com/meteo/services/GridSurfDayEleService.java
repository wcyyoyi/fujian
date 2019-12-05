package yz.com.meteo.services;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import yz.com.core.exception.ServiceException;
import yz.com.meteo.resources.database.GridSurfDayEleResource;

@RequestMapping(value = "/surf/days")
@RestController
public class GridSurfDayEleService{
	@Autowired
	private GridSurfDayEleResource surfdayResource;
	
	@RequestMapping(value = "/grids/{areaCode}/create", method = RequestMethod.GET)
	public Object gridByFields(final HttpServletRequest httpRequest, @PathVariable int areaCode)
			throws ServiceException {
		Map<String, Object> params = ApiService.getRequestParams(httpRequest);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type", "image/png;charset=UTF-8");

		return new ResponseEntity<Object>(surfdayResource.createGrid(areaCode, params), responseHeaders, HttpStatus.OK);
	}

}
