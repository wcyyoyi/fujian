package yz.com.meteo.resources.database;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import yz.com.core.ErrorCodeEnum;
import yz.com.core.exception.ResourceException;
import yz.com.core.rules.ProductRuleName;
import yz.com.core.utils.DateHelper;
import yz.com.resources.database.AgmeRealEleResource;

@Primary
@Service
public class FileAgmeRealEleResource extends AgmeRealEleResource {

	public String uploadFiles(File dir, MultipartFile file, String cAreaCode, String cCropCode, Long time)
			throws IllegalStateException, IOException {
		ProductRuleName prn = new ProductRuleName();
		prn.setExchangeCode("Z");
		prn.setMakeCompany(cAreaCode);
		prn.setProductDate(DateHelper.date2String("yyyyMMddHHmmss", new Date(time)));
		prn.setSystemID("CAGMSS");
		prn.setDataType("REAL");
		prn.setDataElementCode(cCropCode);
		prn.setDataArea("CHN");
		prn.setDataLayer("L88");
		prn.setDataClass("PD");
		prn.setTimelimit("000");
		prn.setTimeInterval("00");
		prn.setDataFormat("jpg");
		String fileName = prn.toString();

		if (file.isEmpty()) {
			throw new ResourceException(ErrorCodeEnum.ERROR_UPLOAD_RESOURCE, file.getOriginalFilename() + "文件损坏！");
		} else {
			File dest = new File(dir, fileName);
			file.transferTo(dest);
		}
		return fileName;
	}
}
