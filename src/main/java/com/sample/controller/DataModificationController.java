package com.sample.controller;

import com.example.demo1.model.DataInsertPOJO;
import com.example.demo1.model.DataRemovePOJO;
import com.example.demo1.model.ResultsInsertionFromUI;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataModificationController {

	@RequestMapping(value = "/insert_data", method = RequestMethod.POST, headers = "Accept=application/json")
	ResponseEntity<String> insertData(@RequestParam String obj) {
		ResultsInsertionFromUI results = new ResultsInsertionFromUI();
		JsonParser jsonParser = new JsonParser();
		DataInsertPOJO di = new DataInsertPOJO();
		JsonElement elementJson = jsonParser.parse(obj);
		JsonObject objJSON = elementJson.getAsJsonObject();
		if (objJSON.get("term_selected") != null && !objJSON.get("term_selected").getAsString().isEmpty()) {
			di.setTerm_selected(objJSON.get("term_selected").getAsString());
			// System.out.println("term_selected "+di.getTerm_selected());
		}
		if (objJSON.get("finding_type") != null && !objJSON.get("finding_type").getAsString().isEmpty()) {
			di.setFinding_type(objJSON.get("finding_type").getAsString());
			// System.out.println("finding_type "+di.getFinding_type());
		}

		if (objJSON.get("history") != null && !objJSON.get("history").getAsString().isEmpty()) {
			di.setHistory(objJSON.get("history").getAsString());
			// System.out.println("history "+di.getHistory());
		}

		if (objJSON.get("term_type") != null && !objJSON.get("term_type").getAsString().isEmpty()) {
			di.setTerm_type(objJSON.get("term_type").getAsString());
			// System.out.println("term_type "+di.getTerm_type());
		}

		if (objJSON.get("file_name") != null && !objJSON.get("file_name").getAsString().isEmpty()) {
			di.setFileName(objJSON.get("file_name").getAsString());
			// System.out.println("file_name "+di.getFileName());
		}

		if (objJSON.get("sentence") != null && !objJSON.get("sentence").getAsString().isEmpty()) {
			di.setSentence(objJSON.get("sentence").getAsString());
			// System.out.println("sentence "+di.getSentence());
		}

		if (objJSON.get("reviewer_name") != null && !objJSON.get("reviewer_name").getAsString().isEmpty()) {
			di.setReviewer(objJSON.get("reviewer_name").getAsString());
			// System.out.println("sentence "+di.getSentence());
		}

		results.insertResults(di.getTerm_selected(), di.getTerm_type(), di.getFinding_type(), di.getHistory(),
				di.getFileName(), di.getSentence(), di.getReviewer());
		// System.out.println("Data Inserted Successfully....!");

		return ResponseEntity.ok(obj);
	}

	@RequestMapping(value = "/remove_data", method = RequestMethod.POST, headers = "Accept=application/json")
	ResponseEntity<String> removeData(@RequestParam String obj) {
		ResultsInsertionFromUI results = new ResultsInsertionFromUI();
		JsonParser jsonParser = new JsonParser();
		DataRemovePOJO di = new DataRemovePOJO();
		JsonElement elementJson = jsonParser.parse(obj);
		JsonObject objJSON = elementJson.getAsJsonObject();
		if (objJSON.get("term_selected") != null && !objJSON.get("term_selected").getAsString().isEmpty()) {
			di.setTerm_selected(objJSON.get("term_selected").getAsString());
			// System.out.println("term_selected "+di.getTerm_selected());
		}

		if (objJSON.get("term_type") != null && !objJSON.get("term_type").getAsString().isEmpty()) {
			di.setTerm_type(objJSON.get("term_type").getAsString());
			// System.out.println("term_type "+di.getTerm_type());
		}

		if (objJSON.get("sentence") != null && !objJSON.get("sentence").getAsString().isEmpty()) {
			di.setSentence(objJSON.get("sentence").getAsString());
			// System.out.println("sentence "+di.getSentence());
		}

		if (objJSON.get("file_name") != null && !objJSON.get("file_name").getAsString().isEmpty()) {
			di.setFileName(objJSON.get("file_name").getAsString());
			// System.out.println("file_name "+di.getFileName());
		}

		if (objJSON.get("reviewer_name") != null && !objJSON.get("reviewer_name").getAsString().isEmpty()) {
			di.setReviewer(objJSON.get("reviewer_name").getAsString());
			// System.out.println("sentence "+di.getSentence());
		}

		results.removeResults(di.getTerm_selected(), di.getTerm_type(), di.getFileName(), di.getSentence(),
				di.getReviewer());
		// System.out.println("Data Removed Successfully....!");

		return ResponseEntity.ok(obj);
	}
}
