package AutoTask.MeteoWarning.utils;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DataBaseUtil {
	static Properties properties = new Properties();

	public DataBaseUtil() {
	}

	public static boolean loadFile(String fileName) {
		try {
			properties.load(DataBaseUtil.class.getClassLoader().getResourceAsStream(fileName));
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public static String getPropertyValue(String key) {
		return properties.getProperty(key);
	}

	private static Connection conn = null;

	public static Connection getConn() {
		String driver = DataBaseUtil.getPropertyValue("driver");
		String url = DataBaseUtil.getPropertyValue("url");
		String username = DataBaseUtil.getPropertyValue("username");
		String password = DataBaseUtil.getPropertyValue("password");

		try {
			Class.forName(driver);
			conn = DriverManager.getConnection(url, username, password);

		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
			close();
		}
		return conn;
	}

	public static void close() {
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
