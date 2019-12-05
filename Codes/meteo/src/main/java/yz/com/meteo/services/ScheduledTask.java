package yz.com.meteo.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import yz.com.core.exception.ResourceException;
import yz.com.resource.services.IdxEventService;
import yz.com.resources.database.AreaCodResource;

@Component
public class ScheduledTask {
	@Autowired
	protected IdxEventService idxEventServ;
	@Autowired
	protected AreaCodResource areaCodRecv;

	@Scheduled(cron = "0 0 8 * * ?")
	public void task() {
		// 0 0 8 * * ? *
		System.out.println("定时任务（预警信息录入）:<" + LocalDateTime.now() + ">");
		areaCodRecv.getAll().forEach(areaCod -> {
			System.out.println(areaCod.getcCode());
			try {
				idxEventServ.createByIdx(areaCod.getcCode());
			} catch (ResourceException e) {
				System.out.println(e.getMessage());
			}
		});
	}
}
