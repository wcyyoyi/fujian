package yz.com.mos.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class PropertiesUtil {
	protected static Logger logger = Logger.getLogger(PropertiesUtil.class.getName());
	static Properties properties = new Properties();

	public PropertiesUtil() {

	}

	public static boolean loadFile() {
		try {
			File configFile = new File("./config/application.properties");
			if(configFile.exists()) {
				logger.info("读取配置文件路径为："+configFile.getAbsolutePath());
				properties.load(new FileInputStream(configFile));
			}else {
				logger.info("读取配置文件路径为默认application.properties");
				properties.load(PropertiesUtil.class.getClassLoader().getResourceAsStream("application.properties"));
			}
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public static String getPropertyValue(String key) {
		return properties.getProperty(key);
	}
}
