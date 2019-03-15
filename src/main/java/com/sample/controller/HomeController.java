package com.sample.controller;

import com.example.demo1.model.ContentFile;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Array;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Stream;

@Controller
public class HomeController {

	static String filesPath = "C:/Users/nmohammad/Downloads/Sample_Spring_Boot/Sample_Spring_Boot/Audit_Files_Updated/";
	static String completed_filesPath = "C:/Users/nmohammad/Downloads/Sample_Spring_Boot/Sample_Spring_Boot/completed_files/";

	public static String connection_string;
	public static String sql_userid;
	public static String sql_pwd;
	public static String sqlFetchRecords;
	public static Connection conn;
	public static ArrayList<String> completed_files;
	public static List<ContentFile> files;
	public static JsonArray objArr1;
	public static JsonArray objArr2;

	public static Connection getDbConnection() {
		initProperties();
		try {
			return sql_userid.isEmpty() ? DriverManager.getConnection(connection_string)
					: DriverManager.getConnection(connection_string, sql_userid, sql_pwd);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	private static void initProperties() {
		try {
			Properties prop = new Properties();
			InputStream inputStream = new FileInputStream(
					"C:/Users/nmohammad/Downloads/Sample_Spring_Boot/Sample_Spring_Boot/src/main/resources/application.properties");
			prop.load(inputStream);
			connection_string = prop.getProperty("spring.datasource.url");
			sql_userid = prop.getProperty("sql_userid", "");
			sql_pwd = prop.getProperty("sql_pwd", "");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/")
	public String index() {
		conn = getDbConnection();
		return "index.html";
	}

	@RequestMapping(value = "/2")
	public String index2() {
		return "home.html";
	}

	@RequestMapping(value = "/files")
	@ResponseBody
	public ResponseEntity<String> getFiles() throws SQLException {
		files = new ArrayList<>();
		try (Stream<Path> paths = Files.walk(Paths.get(filesPath))) {
			paths.filter(Files::isRegularFile).forEach((Path e) -> {
				files.add(new ContentFile(e.getFileName().toString()));
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(files.toString());
	}

	/*
	 * public static void main(String[] args) throws SQLException, IOException {
	 * initProperties(); Statement stmt = null; String queryForAdded =
	 * "select term_selected, term_type, finding_type, history,reviewer from Audit_Data_From_UI where file_name='V00000411900_2147'"
	 * ; String queryForRemoved = "select * from Audit_Data_Remove_From_UI"; try {
	 * conn = getDbConnection(); stmt = conn.createStatement(); ResultSet rsAdded =
	 * stmt.executeQuery(queryForAdded); ResultSetMetaData rsmdAdded =
	 * rsAdded.getMetaData(); // int columnsNumber = rsmdAdded.getColumnCount();
	 * while (rsAdded.next()) { JsonObject obj = new JsonObject();
	 * obj.addProperty("term_selected", rsAdded.getString(1));
	 * obj.addProperty("term_type", rsAdded.getString(2));
	 * obj.addProperty("finding_type", rsAdded.getString(3));
	 * obj.addProperty("history", rsAdded.getString(4)); obj.addProperty("reviewer",
	 * rsAdded.getString(5)); objArr1.add(obj); // System.out.println(obj); //
	 * objArr.add("===================="+obj); }
	 * System.out.println(objArr1.toString()); } finally { if (stmt != null) {
	 * stmt.close(); } }
	 * 
	 * try { files = new ArrayList<>(); try (Stream<Path> paths =
	 * Files.walk(Paths.get(filesPath))) { paths.filter(Files::isRegularFile)
	 * .forEach((Path e) -> { files.add(new
	 * ContentFile(e.getFileName().toString()));
	 * //System.out.println(e.getFileName().toString()); }); } conn =
	 * getDbConnection(); stmt = conn.createStatement(); ResultSet rs =
	 * stmt.executeQuery(query); ResultSetMetaData rsmd = rs.getMetaData(); int
	 * columnsNumber = rsmd.getColumnCount(); InputStream inStream = null;
	 * OutputStream outStream = null; ArrayList<File> aFileList = new ArrayList<>();
	 * while (rs.next()) { for(ContentFile file :files) { String str =
	 * file.toString().substring(13,file.toString().length()-2); for (int i = 1; i
	 * <= columnsNumber; i++) { if(str.equals(rs.getString(i))) { File afile =new
	 * File(filesPath+"\\"+str+".HTML"); aFileList.add(afile); File bfile =new File(
	 * "C:\\Users\\nmohammad\\Downloads\\Sample_Spring_Boot\\Sample_Spring_Boot\\completed_files\\"+str+"
	 * .HTML"); inStream = new FileInputStream(afile); outStream = new
	 * FileOutputStream(bfile); byte[] buffer = new byte[1024]; int length; //copy
	 * the file content in bytes while ((length = inStream.read(buffer)) > 0){
	 * outStream.write(buffer, 0, length); }
	 * 
	 * inStream.close(); outStream.close();
	 * 
	 * System.out.println("File is copied successful!"); } } } for(File file:
	 * aFileList) { file.delete(); } } } finally { if (stmt != null) {
	 * stmt.close();} }
	 * 
	 * }
	 */

	@RequestMapping(value = "/remove_completed_files")
	@ResponseBody
	public ResponseEntity<String> viewCompletedFilesTable() throws SQLException, IOException {
		Statement stmt = null;
		String query = "select * from Audit_Completed_Files";
		try {
			conn = getDbConnection();
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnsNumber = rsmd.getColumnCount();
			InputStream inStream = null;
			OutputStream outStream = null;
			ArrayList<File> aFileList = new ArrayList<>();
			while (rs.next()) {
				for (ContentFile file : files) {
					String str = file.toString().substring(13, file.toString().length() - 2);
					for (int i = 1; i <= columnsNumber; i++) {
						if (str.equals(rs.getString(i))) {
							File afile = new File(filesPath + "\\" + str + ".HTML");
							aFileList.add(afile);
							File bfile = new File(completed_filesPath + str + ".HTML");
							inStream = new FileInputStream(afile);
							outStream = new FileOutputStream(bfile);
							byte[] buffer = new byte[1024];
							int length;
							// copy the file content in bytes
							while ((length = inStream.read(buffer)) > 0) {
								outStream.write(buffer, 0, length);
							}

							inStream.close();
							outStream.close();

							System.out.println("File is copied successful!");
						}
					}
				}
				for (File file : aFileList) {
					if (file.exists())
						file.delete();
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		return ResponseEntity.ok(files.toString());
	}

	@RequestMapping(value = "/completed_files", method = RequestMethod.POST, headers = "Accept=application/json")
	ResponseEntity<String> reviewCompletedFiles(@RequestParam String obj) {
		JsonParser jsonParser = new JsonParser();
		JsonElement elementJson = jsonParser.parse(obj);
		JsonObject objJSON = elementJson.getAsJsonObject();
		try {
			if (objJSON.get("file_name") != null && !objJSON.get("file_name").getAsString().isEmpty()) {
				String sql = "insert into Audit_Completed_Files(completed_files) values (?)";
				PreparedStatement psmt = HomeController.conn.prepareStatement(sql);
				psmt.setString(1, objJSON.get("file_name").toString().replaceAll("\"", ""));
				psmt.addBatch();
				psmt.executeBatch();
				psmt.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(obj);
	}

	@RequestMapping(value = "/file_content/{path}")
	@ResponseBody
//    @CrossOrigin(origins = "http://localhost:8081")
	public ResponseEntity<String> getFileContent(@PathVariable String path) {
		StringBuilder builder = new StringBuilder();
		try (Stream<String> lines = Files.lines(Paths.get(filesPath + path + ".html"))) {
			lines.forEach(s -> {
				//System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ " + s);
//                System.out.println(s);
				builder.append(s);
				builder.append("\n");
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("completed");
		return ResponseEntity.ok(builder.toString());
		// return ResponseEntity.ok(builder.toString().replaceAll("(?m)^[ \t]*\r?\n",
		// ""));
	}

	@RequestMapping(value = "/post_current_file", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<String> viewContent(@RequestParam String fileName) throws SQLException {
		JsonParser jsonParser = new JsonParser();
		JsonElement elementJson = jsonParser.parse(fileName);
		Statement stmt1 = null;
		Statement stmt2 = null;
		JsonObject objFinal = new JsonObject();
		String queryForAdded = "select term_selected, term_type, finding_type, history,reviewer from Audit_Data_From_UI where file_name='"
				+ elementJson.getAsJsonObject().get("fileName").toString().replaceAll("\"", "") + "'";
		String queryForRemoved = "select term_selected, term_type, reviewer from Audit_Data_Remove_From_UI where file_name='"
				+ elementJson.getAsJsonObject().get("fileName").toString().replaceAll("\"", "") + "'";
		//System.out.println("queryForAdded:: " + queryForAdded);
		//System.out.println("queryForRemoved:: " + queryForRemoved);
		try {
			objArr1 = new JsonArray();
			objArr2 = new JsonArray();
			conn = getDbConnection();
			stmt1 = conn.createStatement();
			stmt2 = conn.createStatement();
			ResultSet rsAdded = stmt1.executeQuery(queryForAdded);
			ResultSet rsRemoved = stmt2.executeQuery(queryForRemoved);
			while (rsAdded.next()) {
				JsonObject objAdded = new JsonObject();
				objAdded.addProperty("term_selected", rsAdded.getString(1));
				objAdded.addProperty("term_type", rsAdded.getString(2));
				if (rsAdded.getString(2).equals("Dx") | rsAdded.getString(2).equals("Procedure")) {
					objAdded.addProperty("finding_type", rsAdded.getString(3));
					objAdded.addProperty("history", rsAdded.getString(4));
				}
				objAdded.addProperty("reviewer", rsAdded.getString(5));
				if(objAdded != null)
				objArr1.add(objAdded);
			}

			while (rsRemoved.next()) {
				JsonObject objRemoved = new JsonObject();
				objRemoved.addProperty("term_selected", rsRemoved.getString(1));
				objRemoved.addProperty("term_type", rsRemoved.getString(2));
				objRemoved.addProperty("reviewer", rsRemoved.getString(3));
				objArr2.add(objRemoved);
			}

			objFinal.add("added", objArr1);
			objFinal.add("removed", objArr2);
			// System.out.println(objArr.toString());
			// System.out.println(objArr.get(1));
			return ResponseEntity.ok(objFinal.isJsonNull() ? "No_Data" : objFinal.toString());
		} finally {
			if (stmt1 != null) {
				stmt1.close();
			}
			if (stmt2 != null) {
				stmt2.close();
			}
			objArr1 = null;
			objArr2 = null;
			objFinal = null;
		}
	}
}
