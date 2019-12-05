package yz.com.meteo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import yz.com.annotation.EnableMyBatisScanner;
import yz.com.resources.utils.SpringHelper;

/**
 * Created by zf on 17/8/17.
 */

@EnableEurekaClient
@EnableFeignClients(basePackages = "yz.com.remote.services.api")
@ComponentScan(basePackages = "yz.com")
@EnableMyBatisScanner(value = "user")
@SpringBootApplication
@EnableScheduling
@EnableCaching  
public class AppForMeteo {
	public static void main(String[] args) {
		ApplicationContext app = SpringApplication.run(AppForMeteo.class, args);
		SpringHelper.setApplicationContext(app);
		SpringHelper.setRootPath(AppForMeteo.class);
	}

	@Bean
	public WebMvcConfigurerAdapter webMvcConfigurerAdapter() {
		WebMvcConfigurerAdapter webMvcConfigurerAdapter = new WebMvcConfigurerAdapter() {
			@Override
			public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
				configurer.favorPathExtension(false);
			}
		};
		return webMvcConfigurerAdapter;
	}

}
