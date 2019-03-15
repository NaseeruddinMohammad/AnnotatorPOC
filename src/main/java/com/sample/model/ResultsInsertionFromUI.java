package com.sample.model;

import java.sql.PreparedStatement;
import com.example.demo1.controller.HomeController;

public class ResultsInsertionFromUI {

	public void insertResults(String term_selected, String term_type, String finding_type, String history,
			String file_name, String sentence, String reviewer) {
		try {
			String sql = "insert into Audit_Data_From_UI(term_selected, term_type, finding_type, history, file_name, sentence, reviewer) values(?,?,?,?,?,?,?)";

			PreparedStatement psmt = HomeController.conn.prepareStatement(sql);
			psmt.setString(1, term_selected);
			psmt.setString(2, term_type);
			psmt.setString(3, finding_type);
			psmt.setString(4, history);
			psmt.setString(5, file_name);
			psmt.setString(6, sentence);
			psmt.setString(7, reviewer);
			psmt.addBatch();
			psmt.executeBatch();
			psmt.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void removeResults(String term_selected, String term_type, String file_name, String sentence,
			String reviewer) {
		try {
			String sql = "insert into Audit_Data_Remove_From_UI(term_selected, term_type, file_name, sentence, reviewer) values(?,?,?,?,?)";

			PreparedStatement psmt = HomeController.conn.prepareStatement(sql);
			psmt.setString(1, term_selected);
			psmt.setString(2, term_type);
			psmt.setString(3, file_name);
			psmt.setString(4, sentence);
			psmt.setString(5, reviewer);
			psmt.addBatch();
			psmt.executeBatch();
			psmt.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
