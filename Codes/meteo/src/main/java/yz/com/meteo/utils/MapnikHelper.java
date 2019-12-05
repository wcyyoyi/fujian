package yz.com.meteo.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import yz.com.core.models.gdal.GridExtent;
import yz.com.resources.utils.SpringHelper;

public class MapnikHelper {
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	public static final String RENDER_NAME = "Render.py";
	private String pythonPath = "python";

	private static MapnikHelper instance;

	private MapnikHelper() {

	}

	public static MapnikHelper getInstance() {
		if (instance != null)
			return instance;

		instance = new MapnikHelper();
		return instance;
	}

	public int Render(String fileName, GridExtent extent, String eleName) {
		String progParams = String.format("%s %s %s %s %s %s %s", fileName, extent.getxMin(), extent.getxMax(),
				extent.getyMin(), extent.getyMax(), extent.getResoultion(), eleName);

		try {
			String renderScript = getScriptResource(RENDER_NAME);
			return executePython(renderScript, progParams);
		} catch (Exception ex) {
			throw new RuntimeException("Render 【" + fileName + "】 is failed! ", ex);
		}
	}

	private int executePython(String progFileName, String progParams) throws IOException, InterruptedException {
		// 可执行文件路径和工作目录
		File progFile = new File(progFileName);
		File workDir = new File(progFile.getAbsoluteFile().getParent());
		progFileName = progFile.getName();

		// 配置可执行程序的传入参数，如果存在
		if (progParams != null && !progParams.equals(""))
			progFileName += " " + progParams;

		// 设置Python工作环境
		progFileName = pythonPath + " " + progFileName;

		// 运行可执行程序
		logger.info("execute command is: " + progFileName);
		Process instance = Runtime.getRuntime().exec(progFileName, null, workDir);

		WriteLogger(instance.getInputStream());
		WriteLogger(instance.getErrorStream());

		// // 错误流
		// ProgStreamOutput errorGobbler = new
		// ProgStreamOutput(instance.getErrorStream(),
		// ProgStreamOutput.STREAM_ERROR, logger);
		// // 输出流
		// ProgStreamOutput outputGobbler = new
		// ProgStreamOutput(instance.getInputStream(),
		// ProgStreamOutput.STREAM_INFO, logger);
		//
		// // 写日志
		// errorGobbler.start();
		// outputGobbler.start();

		// 超时设置
		int timeout = 1;
		int rc = -1;

		// 阻塞操作
		if (timeout < 0) {
			rc = instance.waitFor();
		} else {
			if (instance.waitFor(timeout, TimeUnit.SECONDS)) {
				rc = instance.exitValue();
			} else {
				rc = -999;
			}
		}
		logger.info("execute command is over! return value: " + rc);
		return rc;
	}

	// private boolean isAlive(Process p) {
	// try {
	// p.exitValue();
	// return false;
	// } catch (IllegalThreadStateException e) {
	// return true;
	// }
	// }

	private void WriteLogger(InputStream is) {
		InputStreamReader isr = null;
		BufferedReader br = null;

		try {
			isr = new InputStreamReader(is);
			br = new BufferedReader(isr);
			String line = null;

			while ((line = br.readLine()) != null) {
				logger.info(line);
			}

			isr.close();
			br.close();
		} catch (IOException ex) {
			logger.error(ex.getMessage(), ex);
		}
	}

	private String getScriptResource(String name) {
		// 查找脚本文件
		String scriptName = "scripts/" + name;
		return SpringHelper.getReousrce(scriptName);
	}

	public void setPythonPath(String pythonPath) {
		this.pythonPath = pythonPath;
	}

	public static void main(String[] args) {
		MapnikHelper mh = new MapnikHelper();
		GridExtent ext = new GridExtent();
		ext.setxMin(116.99774940457);
		ext.setxMax(119.24774940457);
		ext.setyMin(26.2667113045743);
		ext.setyMax(28.3167113045743);
		ext.setResoultion(0.05);

		mh.Render("D:/app/www/admin2/350700.img", ext, "v12052");
	}
}
