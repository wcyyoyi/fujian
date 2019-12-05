package yz.com.meteo.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProgStreamOutput extends Thread {
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	private InputStream is;
	private String type;
	private Logger progLogger;
	
	public static final String STREAM_ERROR = "ERROR";
	public static final String STREAM_INFO = "INFO";

	public ProgStreamOutput(InputStream is, String type, Logger progLogger) {
		this.is = is;
		this.type = type;
		this.progLogger = progLogger;
	}

	public void run() {
		InputStreamReader isr = null;
		BufferedReader br = null;

		try {
			isr = new InputStreamReader(is);
			br = new BufferedReader(isr);
			String line = null;

			while ((line = br.readLine()) != null) {
				if (this.type.equals(STREAM_ERROR)) {
					progLogger.error(line);
				} else {
					progLogger.info(line);
				}
			}

			isr.close();
			br.close();
		} catch (IOException ex) {
			logger.error(ex.getMessage(), ex);
		}
	}
}
