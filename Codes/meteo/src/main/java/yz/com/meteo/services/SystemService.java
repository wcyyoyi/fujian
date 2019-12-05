package yz.com.meteo.services;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import yz.com.core.ErrorCodeEnum;
import yz.com.core.exception.ServiceException;
import yz.com.meteo.enums.SystemCatalogEnum;
import yz.com.models.UrlUser;

@Api(tags = "前台系统服务接口")
@RequestMapping(value = "/system")
@RestController
public class SystemService {
	private static final String SYSTEMFOLDERPATH = "/app/system/";
	private static final String BANNERFOLDERPATH = "banner/";

	@ApiOperation(value = "获取所有图片（banner）列表")
	@RequestMapping(value = "/listALL/pic/banner", method = RequestMethod.GET)
	public Object getBannerList() {
		List<String> picNameList = new ArrayList<String>();

		for (SystemCatalogEnum systemCatalogEnum : SystemCatalogEnum.values()) {
			picNameList.addAll(Arrays.asList(getFolderPath(systemCatalogEnum).list()));
		}
		return new ResponseEntity<List<String>>(picNameList, HttpStatus.OK);
	}

	@ApiOperation(value = "获取多个等级的图片（banner）列表")
	@ApiImplicitParam(name = "levels", value = "以','分隔的等级数字字符串")
	@RequestMapping(value = "/list/pic/banner", method = RequestMethod.GET)
	public Object getBannerListByLevel(@RequestParam String levels) {
		List<String> picNameList = new ArrayList<String>();

		String[] levelStrArr = levels.split(",");
		for (String levelStr : levelStrArr) {
			int level = Integer.parseInt(levelStr);
			picNameList.addAll(Arrays.asList(getFolderPath(SystemCatalogEnum.fromCode(level)).list()));
		}
		return new ResponseEntity<List<String>>(picNameList, HttpStatus.OK);
	}

	@ApiOperation(value = "获取图片（banner）")
	@RequestMapping(value = "/pic/banner", method = RequestMethod.GET)
	public Object getBanner(@RequestParam String name) {
		File file = null;
		for (SystemCatalogEnum systemCatalogEnum : SystemCatalogEnum.values()) {
			if (Arrays.asList(getFolderPath(systemCatalogEnum).list()).contains(name)) {
				file = new File(getFolderPath(systemCatalogEnum), name);
				break;
			}
		}

		if (file == null) {
			throw new ServiceException(ErrorCodeEnum.ERROR_NODATA_RESOURCE, name + "不存在!");
		}

		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type", "image/png;charset=UTF-8");
		return new ResponseEntity<Object>(new FileSystemResource(file), responseHeaders, HttpStatus.OK);
	}

	@ApiOperation(value = "删除图片（banner）")
	@RequestMapping(value = "/pic/banner/delete", method = RequestMethod.GET)
	public Object deleteBanner(@RequestParam String name) {
		File file = null;
		for (SystemCatalogEnum systemCatalogEnum : SystemCatalogEnum.values()) {
			if (Arrays.asList(getFolderPath(systemCatalogEnum).list()).contains(name)) {
				file = new File(getFolderPath(systemCatalogEnum), name);
				break;
			}
		}

		if (file == null) {
			throw new ServiceException(ErrorCodeEnum.ERROR_NODATA_RESOURCE, name + "不存在!");
		}
		return new ResponseEntity<Boolean>(file.delete(), HttpStatus.OK);
	}

	@ApiOperation(value = "上传图片（banner）到指定临时目录")
	@RequestMapping(value = "/pic/banner/upload/{level}", method = RequestMethod.POST, headers = "content-type=multipart/form-data")
	public Object uploadBannerToDefault(@ApiParam(value = "文件", required = true) MultipartFile file,
			@ApiParam(value = "等级", required = true) @PathVariable int level)
			throws IllegalStateException, IOException {
//		MultipartFile file = ((MultipartHttpServletRequest) httpRequest).getFile("file");
		return new ResponseEntity<String>(uploadBanner(file, getFolderPath(SystemCatalogEnum.fromCode(level))),
				HttpStatus.OK);
	}

	private String uploadBanner(MultipartFile file, File folder) throws IllegalStateException, IOException {
		if (file.isEmpty()) {
			throw new ServiceException(ErrorCodeEnum.ERROR_UPLOAD_SERVICE, file.getName() + "文件不存在！");
		}
		String suf = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
		if (".png".equals(suf.toLowerCase()) || ".jpg".equals(suf.toLowerCase())) {
			String filename = UUID.randomUUID().toString() + suf;
			File resultFile = new File(folder, filename);
			FileUtils.copyInputStreamToFile(file.getInputStream(), resultFile);
			return filename;
		} else {
			throw new ServiceException(ErrorCodeEnum.ERROR_PARAMSFORMATNOTRIGHT_RESOURCE, "文件格式不正确，请上传jpg或png格式的图片！");
		}
	}

	private File getFolderPath(SystemCatalogEnum systemCatalogEnum) {
		String path = SYSTEMFOLDERPATH + BANNERFOLDERPATH + systemCatalogEnum.toString();
		if (SystemCatalogEnum.AREA.equals(systemCatalogEnum)) {
			UrlUser user = (UrlUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			path = path + File.separator + user.getAreaCode();
		}

		File defaultFile = new File(path);
		if (!defaultFile.exists()) {
			defaultFile.mkdirs();
		}
		System.out.println(defaultFile.getAbsolutePath());
		return defaultFile;
	}
}
