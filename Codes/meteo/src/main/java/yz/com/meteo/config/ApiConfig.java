package yz.com.meteo.config;

import java.time.DayOfWeek;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "product.config")
public class ApiConfig{
	/**
	 * 产品存放根路径
	 */
	private String prodPath;

	/**
	 * python运行环境路径
	 */
	private String pythonPath;

	/**
	 * 周报产品开始星期
	 */
	private int weekStart = 5;

	public int getWeekStart() {
		return weekStart;
	}

	public DayOfWeek getWeekStartDay() {
		switch (this.weekStart) {
		case 1:
			return DayOfWeek.MONDAY;
		case 2:
			return DayOfWeek.TUESDAY;
		case 3:
			return DayOfWeek.WEDNESDAY;
		case 4:
			return DayOfWeek.THURSDAY;
		case 5:
			return DayOfWeek.FRIDAY;
		case 6:
			return DayOfWeek.SATURDAY;
		case 7:
			return DayOfWeek.SUNDAY;
		default:
			return DayOfWeek.MONDAY;
		}

	}

	public void setWeekStart(int weekStart) {
		this.weekStart = weekStart;
	}

	public String getProdPath() {
		return prodPath;
	}

	public void setProdPath(String prodPath) {
		this.prodPath = prodPath;
	}

	public String getPythonPath() {
		return pythonPath;
	}

	public void setPythonPath(String pythonPath) {
		this.pythonPath = pythonPath;
	}
}
