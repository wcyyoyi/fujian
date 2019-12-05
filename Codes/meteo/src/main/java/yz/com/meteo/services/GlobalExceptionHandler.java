package yz.com.meteo.services;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import yz.com.core.BaseException;
import yz.com.core.ErrorCodeEnum;
import yz.com.core.exception.ServiceException;
import yz.com.core.models.RestServiceError;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
	@ResponseStatus(value = HttpStatus.BAD_REQUEST) // 400
	@ExceptionHandler(ServiceException.class)
	public RestServiceError handleValidationException(ServiceException ex) {
		return RestServiceError.build(400, ex.getErrorCode(), ex.getMessage());
	}

	// 通用异常的处理，返回500
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR) // 500
	@ExceptionHandler(Exception.class)
	public RestServiceError handleException(Exception ex) {
		if (ex instanceof BaseException) {
			BaseException myException = (BaseException) ex;
			return RestServiceError.build(500, myException.getErrorCode(), myException.getMessage());
		} else {
			return RestServiceError.build(500, ErrorCodeEnum.ERROR_SERVICE, ex.getMessage());
		}
	}
}
