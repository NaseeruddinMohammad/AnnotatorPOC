package com.sample.model;

import com.google.gson.Gson;

public class DataRemovePOJO {

	String term_selected;
	String term_type;
	String file_name;
	String sentence;
	String reviewer;

	public void setTerm_selected(String term_selected) {
		this.term_selected = term_selected;
	}

	public String getTerm_selected() {
		return term_selected;
	}

	public void setTerm_type(String term_type) {
		this.term_type = term_type;
	}

	public String getTerm_type() {
		return term_type;
	}

	public String getFileName() {
		return file_name;
	}

	public void setFileName(String file_name) {
		this.file_name = file_name;
	}

	public String getSentence() {
		return sentence;
	}

	public void setSentence(String sentence) {
		this.sentence = sentence;
	}

	public String getReviewer() {
		return reviewer;
	}

	public void setReviewer(String reviewer) {
		this.reviewer = reviewer;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

}
