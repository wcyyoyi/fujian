package yz.com.meteo.exception;

import yz.com.core.BaseException;
import yz.com.core.ErrorCodeEnum;

public class WordResourceException extends BaseException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8302858561936795683L;

	public WordResourceException() {
		super(ErrorCodeEnum.ERROR_WORD_PRODUCT_RESOURCE);
	}

	public WordResourceException(String message) {
		super(ErrorCodeEnum.ERROR_WORD_PRODUCT_RESOURCE, message);
	}

}
