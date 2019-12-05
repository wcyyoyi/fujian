package yz.com.meteo.resources.database;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import yz.com.bean.znq.MangCropStatCod;
import yz.com.bean.znq.StatCod;
import yz.com.core.exception.ServiceException;
import yz.com.remote.services.api.IStatCodService;
import yz.com.resources.database.MangCropStatCodResource;

@Service
public class MeteoStatCodResource {
	@Autowired
	IStatCodService statCodService;
	@Autowired
	private MangCropStatCodResource mangCropStatCodRes;

	public List<StatCod> getByCropName(@RequestParam String cropName) throws ServiceException {
		List<StatCod> statList = new ArrayList<StatCod>();
		
		List<MangCropStatCod> mangCropStatCodList = mangCropStatCodRes.getByCropname(cropName);
		for (MangCropStatCod mangCropStatCod : mangCropStatCodList) {
			try{
				StatCod statCod = statCodService.detail(mangCropStatCod.getV01000());
				statList.add(statCod);
			}catch (Exception e) {
			}
		}
		return statList;
	}
}
