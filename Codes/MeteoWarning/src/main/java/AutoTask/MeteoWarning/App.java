package AutoTask.MeteoWarning;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import AutoTask.MeteoWarning.utils.DataBaseUtil;

public class App {
	private static String PREFIX = "台风";
	private static String POSTFIX = ".doc";

	public static void main(String[] args) {
		DataBaseUtil.loadFile("application.properties");
		try {
			if (FindFile()) {
				if (update()) {
					System.out.println(LocalDateTime.now() + "\t成功更新一条数据");
				} else {
					System.out.println(LocalDateTime.now() + "\t数据库没有对应数据");
				}
			} else {
				System.out.println(LocalDateTime.now() + "\t" + DataBaseUtil.getPropertyValue("path") + "下没有对应文件");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	private static boolean update() throws SQLException {
		String dateStr = LocalDate.now() + " 00:00:00";
		Connection conn = DataBaseUtil.getConn();
		String sql = "UPDATE T_R_AGME_IDX_EVENT SET V_ALERT_LEVEL = 1 WHERE D_EVENTTIME ='" + dateStr
				+ "' AND C_DESC LIKE '%台风%'";
		PreparedStatement pst;
		pst = conn.prepareStatement(sql);
		boolean result = pst.executeUpdate() > 0;
		pst.close();
		conn.close();
		return result;

	}

	private static boolean FindFile() {
		File baseFile = new File(DataBaseUtil.getPropertyValue("path"));
		if (baseFile.isFile() || !baseFile.exists()) {
			return false;
		}
		File[] files = baseFile.listFiles();
		for (File file : files) {
			String fileName = file.getName();
			if (!file.isDirectory() && fileName.startsWith(PREFIX) && fileName.endsWith(POSTFIX)) {
				Instant instant = Instant.ofEpochMilli(file.lastModified());
				ZoneId zone = ZoneId.systemDefault();
				if (LocalDateTime.ofInstant(instant, zone).getHour() == LocalDateTime.now().getHour()) {
					return true;
				}
			}
		}
		return false;
	}

}
