package yz.com.mos;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import yz.com.mos.models.MosData;
import yz.com.mos.models.MosDataHeader;
import yz.com.mos.models.MosFileHeader;
import yz.com.mos.utils.DataBaseConc;
import yz.com.mos.utils.PropertiesUtil;

public class App {
	protected static Logger logger = Logger.getLogger(App.class.getName());
	protected static DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

	// 传入参数时间全为北京时间
	public static void main(String[] args) throws UnsupportedEncodingException {
		PropertyConfigurator.configure(App.class.getClassLoader().getResource("log4j.properties"));
		logger.info("v20191024");
		logger.info(new String("传入参数时间全为北京时间！test".getBytes(),"UTF-8"));
		System.out.println("传入参数时间全为北京时间！test1");
		System.out.println(new String("传入参数时间全为北京时间！test2".getBytes(),"UTF-8"));
		logger.info("传入参数时间全为北京时间！");
		logger.info("北京时间8点到20点读世界时间前一天的12点文件");
		logger.info("北京时间20点到次日8点读世界时间0点文件");

		List<String[]> ldtStrList = new ArrayList<String[]>();

		for (int i = 0; i < args.length; i++) {
			String[] argArr = args[i].split("=");
			args[i] = argArr.length > 2 ? argArr[1].trim() : argArr[0];
			logger.info(args[i]);
		}

		if (args.length != 0 && args.length != 1 && args.length != 2) {
			logger.info("请输入0、1或2个时间参数，当前获取的参数个数为：" + args.length);
			return;
		} else if (args.length == 0) {

			LocalDateTime ldt = LocalDateTime.now();
			// 清除分、秒
			ldt = ldt.plusMinutes(-ldt.getMinute());
			ldt = ldt.plusSeconds(-ldt.getSecond());

			// 北京时间转世界时间
			ldt = ldt.plusHours(-8);
			if (ldt.getHour() >= 0 && ldt.getHour() < 12) {
				ldt = ldt.plusHours(-ldt.getHour());// 北京时间8点到20点读世界时间前一天的12点文件
				ldt = ldt.plusHours(-12);
			} else {
				ldt = ldt.plusHours(12 - ldt.getHour());// 北京时间20点到次日8点读世界时间0点文件
				ldt = ldt.plusHours(-12);
			}

			LocalDateTime nextLdt = ldt.plusHours(12);

			String[] ldtStrArr = new String[2];
			ldtStrArr[0] = df.format(ldt);
			ldtStrArr[1] = df.format(nextLdt).substring(0, df.format(nextLdt).length() - 2);

			ldtStrList.add(ldtStrArr);
		} else if (args.length == 1) {
			try {
				String ldtStr = args[0];
				LocalDateTime ldt = LocalDateTime.parse(ldtStr, df);
				ldt = ldt.plusMinutes(-ldt.getMinute());
				ldt = ldt.plusSeconds(-ldt.getSecond());

				// 北京时间转世界时间
				ldt = ldt.plusHours(-8);
				if (ldt.getHour() >= 0 && ldt.getHour() < 12) {
					ldt = ldt.plusHours(-ldt.getHour());// 北京时间8点到20点读世界时间0点文件
				} else {
					ldt = ldt.plusHours(12 - ldt.getHour());// 北京时间20点到8点读世界时间12点文件
				}

				LocalDateTime nextLdt = ldt.plusHours(12);
				String[] ldtStrArr = new String[2];
				ldtStrArr[0] = df.format(ldt);
				ldtStrArr[1] = df.format(nextLdt).substring(0, df.format(nextLdt).length() - 2);

				ldtStrList.add(ldtStrArr);
			} catch (DateTimeParseException e) {
				logger.info("时间格式不正确，请输入yyyyMMddHHmmss格式的时间字符串");
				return;
			}

		} else if (args.length == 2) {
			try {
				String startLdtStr = args[0];
				String endLdtStr = args[1];
				LocalDateTime sldt = LocalDateTime.parse(startLdtStr, df);
				LocalDateTime eldt = LocalDateTime.parse(endLdtStr, df);
				sldt = sldt.plusMinutes(-sldt.getMinute());
				sldt = sldt.plusSeconds(-sldt.getSecond());
				eldt = eldt.plusMinutes(-eldt.getMinute());
				eldt = eldt.plusSeconds(-eldt.getSecond());

				// 北京时间转世界时间
				sldt = sldt.plusHours(-8);
				if (sldt.getHour() >= 0 && sldt.getHour() < 12) {
					sldt = sldt.plusHours(-sldt.getHour());// 北京时间8点到20点读世界时间0点文件
				} else {
					sldt = sldt.plusHours(12 - sldt.getHour());// 北京时间20点到8点读世界时间12点文件
				}

				eldt = eldt.plusHours(-8);
				if (eldt.getHour() >= 0 && eldt.getHour() < 12) {
					eldt = eldt.plusHours(-eldt.getHour());// 北京时间8点到20点读世界时间0点文件
				} else {
					eldt = eldt.plusHours(12 - eldt.getHour());// 北京时间20点到8点读世界时间12点文件
				}

				long hours = sldt.until(eldt, ChronoUnit.HOURS);
				int l = ((int) hours / 12) + 1;

				for (int i = 0; i < l; i++) {
					LocalDateTime nextLdt = sldt.plusHours(12);
					String[] ldtStrArr = new String[2];
					ldtStrArr[0] = df.format(sldt);
					ldtStrArr[1] = df.format(nextLdt).substring(0, df.format(nextLdt).length() - 2);

					ldtStrList.add(ldtStrArr);
					sldt = sldt.plusHours(12);
				}

			} catch (DateTimeParseException e) {
				logger.info("时间格式不正确，请输入yyyyMMddHHmmss格式的时间字符串");
				return;
			}
		}

		PropertiesUtil.loadFile();
		String fileDir = PropertiesUtil.getPropertyValue("mosDataPath");
		String fileNameTemp = PropertiesUtil.getPropertyValue("fileNameTemp");

		for (String[] ldtStr : ldtStrList) {
			String fileName = MessageFormat.format(fileNameTemp, ldtStr[0], ldtStr[1]);

			File file = new File(fileDir, fileName);
			logger.info("读取文件名为：" + file.getName());

			if (!file.exists()) {
				logger.warn(file.getAbsoluteFile() + "文件不存在！");
				return;
			}

			List<MosData> mosDataList = readTxt(file);
			if (mosDataList == null) {
				logger.info("读取数据为空");
				return;
			}
			int count = 0;
			int step = 1000;
			StringBuffer sb = new StringBuffer();
			for (MosData mosData : mosDataList) {
				count++;
				if (count % step == 0) {
					String sql = sb.toString();
					sb = new StringBuffer();
					logger.info(file.getName() + ":第" + (count - step + 1) + "~" + count + "条数据插入结果：" + insert(sql));
				}
				sb.append(mosData.toInsertSql());
			}
			logger.info("最后" + (count % step) + "条数据插入结果：" + insert(sb.toString()));
			logger.info(ldtStr + "录入完成");
		}
		logger.info("程序执行结束");

	}

	private static List<MosData> readTxt(File file) {
		try {
			@SuppressWarnings("resource")
			BufferedReader br = new BufferedReader(new FileReader(file));
			String s = null;
			int count = 0;
			int dataHeadLine = 6;
			MosFileHeader mosFileHeader = null;
			MosDataHeader mosDataHeader = null;
			List<MosDataHeader> mosDataHeaderList = new ArrayList<MosDataHeader>();
			List<MosData> mosDataList = new ArrayList<MosData>();
			int statCount = 0;
			while ((s = br.readLine()) != null) {// 使用readLine方法，一次读一行
				count++;
				// 过滤前4行信息
				if (count < 4)
					continue;
				if (count == 5) {
					List<String> statCountList = makeData(s.split(" "));
					if (statCountList.size() == 1) {
						statCount = Integer.parseInt(statCountList.get(0));
						logger.info("站点数量读取完毕！");
						continue;
					} else {
						logger.info("站点数量格式不正确");
						break;
					}
				}
				if (count == 4) {
					List<String> fileHead = makeData(s.split(" "));
					if (fileHead.size() == 2) {
						String dateStr = fileHead.get(1);
						mosFileHeader = new MosFileHeader();
						mosFileHeader.setV04001(Integer.parseInt(dateStr.substring(0, 4)));
						mosFileHeader.setV04002(Integer.parseInt(dateStr.substring(4, 6)));
						mosFileHeader.setV04003(Integer.parseInt(dateStr.substring(6, 8)));
						mosFileHeader.setV04004(Integer.parseInt(dateStr.substring(8, 10)));

						logger.info("文件头信息读取完毕！");
						continue;
					} else {
						logger.info("文件头信息格式不正确");
						break;
					}
				}
				if (count == dataHeadLine) {
					List<String> dataHead = makeData(s.split(" "));
					if (dataHead.size() == 6) {
						mosDataHeader = new MosDataHeader(dataHead);
						dataHeadLine += mosDataHeader.getDataCount() + 1;
						mosDataHeaderList.add(mosDataHeader);
						// logger.info("第" + count + "行数据头信息读取完毕！");
						continue;
					} else {
						logger.info("第" + count + "行数据头信息格式不正确");
						break;
					}
				}
				List<String> data = makeData(s.split(" "));
				if (data.size() == mosDataHeader.getEleCount() + 1) {
					MosData mosData = new MosData(mosFileHeader, mosDataHeader, data);
					mosData.setVdate(mosFileHeader.getV04001() + "/" + mosFileHeader.getV04002() + "/"
							+ mosFileHeader.getV04003() + " " + mosFileHeader.getV04004() + ":00:00");
					mosDataList.add(mosData);
					// logger.info("第" + count + "行数据读取完毕！");
				} else {
					logger.info("第" + count + "行数据格式不正确");
					break;
				}
			}

			if (mosDataHeaderList.size() == statCount) {
				logger.info("数据读取完成！");
				return mosDataList;
			} else {
				logger.info("数据有丢失");
				return null;
			}
		} catch (FileNotFoundException e) {
			logger.info(e.getMessage());
		} catch (IOException e) {
			logger.info(e.getMessage());
		}
		return null;
	}

	private static boolean insert(String sql) {
		boolean result = false;
		try {
			Connection conn = DataBaseConc.getConn();
			PreparedStatement pst;
			pst = conn.prepareStatement(sql);
			result = pst.executeUpdate() > 0;
			pst.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}

	private static List<String> makeData(String[] dataArr) {
		List<String> dataList = new ArrayList<String>();
		for (String str : dataArr) {
			if (!"".equals(str)) {
				dataList.add(str);
			}
		}
		return dataList;
	}
}
