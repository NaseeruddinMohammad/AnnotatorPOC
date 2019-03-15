package com.sample.model;

import com.google.gson.Gson;

public class ContentFile {

    String fileName;

    public ContentFile(String fileName) {
        this.fileName = fileName.contains(".") ? fileName.split("\\.",-1)[0] : fileName;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public String toString() {
        return new Gson().toJson(this);
    }
}
