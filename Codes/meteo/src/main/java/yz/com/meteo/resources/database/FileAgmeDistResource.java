package yz.com.meteo.resources.database;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import yz.com.core.ErrorCodeEnum;
import yz.com.core.exception.ResourceException;
import yz.com.core.rules.ProductRuleName;
import yz.com.core.utils.DateHelper;
import yz.com.resources.database.AgmeDistResource;

@Primary
@Service
public class FileAgmeDistResource extends AgmeDistResource {

	public String uploadFiles(File dir, MultipartFile file, String cAreaCode, String cDistCode, Long time)
			throws IllegalStateException, IOException {
		ProductRuleName prn = new ProductRuleName();
		prn.setExchangeCode("Z");
		prn.setBusinessCode("AGME");
		prn.setMakeCompany(cAreaCode);
		prn.setProductDate(DateHelper.date2String("yyyyMMddHHmmss", new Date(time)));
		prn.setSystemID("CAGMSS");
		prn.setDataType("ADRM");
		prn.setDataElementCode(cDistCode);
		prn.setDataArea("CHN");
		prn.setDataLayer("L88");
		prn.setDataClass("PD");
		prn.setTimelimit("000");
		prn.setTimeInterval("00");
		prn.setDataFormat("dis");
		prn.setResolution("5KM");
		String fileName = prn.toString();

		if (file.isEmpty()) {
			throw new ResourceException(ErrorCodeEnum.ERROR_UPLOAD_RESOURCE, file.getOriginalFilename() + "文件损坏！");
		} else {
			File dest = new File(dir.getAbsolutePath(), fileName);
			FileUtils.copyInputStreamToFile(file.getInputStream(), dest);
//			file.transferTo(dest);
		}
		return fileName;
	}
}
