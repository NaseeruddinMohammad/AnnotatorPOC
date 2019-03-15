function toggleResultDiv(conte) {
	var y = document.getElementById("container");
	var z = document.getElementById("filesList");
	document.getElementById("selcontent").innerHTML = conte;
	var divData = document.getElementById("container");
	var att = document.createAttribute("data-target");
	var att1 = document.createAttribute("class");
	var att2 = document.createAttribute("data-toggle");
	att1.value = "btn btn-info btn-sm mr-1";
	att2.value = "modal";
	att.value = "#myModal1";
	if (conte.toString().length > 0) {
		divData.setAttributeNode(att);
		divData.setAttributeNode(att1);
		divData.setAttributeNode(att2);
	}
}

function closePopUp() {
	var divData = document.getElementById("container");
	divData.removeAttribute("data-target");
	divData.removeAttribute("class");
	divData.removeAttribute("data-toggle");
}

var sentence;
function selectionContent() {
	var txt = "";
	if (window.getSelection) {
		txt = window.getSelection();
		if (txt.anchorNode && txt.anchorNode.data !== null) {
			sentence = txt.anchorNode.data;
		}
	} else if (document.getSelection) {
		txt = document.getSelection();
	} else if (document.selection) {
		txt = document.selection.createRange().text;
	}
	toggleResultDiv(txt)
}
function OnChangeRadio(radio) {
	// alert ("The " + radio.value + " radio is selected.");
	changeVisibility(radio.value)
}
function changeVisibility(value) {
	if ((value === "Dx") || (value === "Procedure")) {
		document.getElementById("finding_types1").style.display = "block";
		document.getElementById("history_types1").style.display = "block";
	} else {
		document.getElementById("finding_types1").style.display = "none";
		document.getElementById("history_types1").style.display = "none";
	}
}
function changeVisibilityWithValues(value, status, history) {
	changeVisibility(value)
	if (status.length != 0) {
		var values = document.getElementsByName("finding_types1")
		for (var i = 0; i < values.length; i++) {
			values[i].checked = (values[i].value.toLowerCase() === status
					.toLowerCase())
		}
	} else {
		document.getElementById("finding_types1").style.display = "none";
	}
	var hist_values = document.getElementsByName("history_types1")
	for (var i = 0; i < hist_values.length; i++) {
		hist_values[i].checked = (hist_values[i].value.toLowerCase() === history
				.toLowerCase())
	}
}

function closeResultOverlay() {
	toggleResultDiv('');
}
var currentFileName;

function loadDoc(fileName) {
	$('#updateresult').show();
	$('#showAdded').hide();
	$('#msgAdded').show();
	currentFileName = fileName;
	$.ajax({
        url: '/file_content/'+fileName,
        type: 'get',
        success: function(data){
            $('#container').html(data);
            document.getElementById("file_name").innerHTML = "File : "+fileName 
            	+ '<div><input type="button" class="btn btn-info btn-sm" name="completed" onclick="completedFilesInsertion()" value="complete review" /></div>';
        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            $('#content').html(errorMsg);
          }
    });
	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		document.getElementById("container").innerHTML = this.responseText
	// 				+ '<input type="button" class="btn btn-info btn-sm" name="completed" onclick="completedFilesInsertion()" value="completed" />';
	// 	}
	// };
	// xhttp.open("GET", "/file_content/" + fileName, true);
	// xhttp.send();

	var obj = {
		"fileName" : fileName
	}
	var y = document.getElementById("container");
	y.style.width = "60%";
	document.getElementById("valuesAdded").innerHTML = "";
	document.getElementById("valuesRemoved").innerHTML = "";

	$
			.ajax({
				url : '/post_current_file',
				type : 'POST',
				data : {
					"fileName" : JSON.stringify(obj),
				},
				contentType : "application/x-www-form-urlencoded",
			})
			.done(
					function(data) {
						if (data === "No_Data") {
							document.getElementById("valuesAdded").innerHTML += "No Data";
						}
						if (data.added !== "No_Data") {
							for ( var i in data.added) {
								if (data.added[i].term_selected !== undefined) {
									document.getElementById("valuesAdded").innerHTML += "<li> term: "
											+ data.added[i].term_selected;
								}
								if (data.added[i].term_type !== undefined) {
									document.getElementById("valuesAdded").innerHTML += "type: "
											+ data.added[i].term_type;
									if (data.added[i].term_type === "Meds"
											| data.added[i].term_type === "Labs"
											| data.added[i].term_type === "Vitals") {
										document.getElementById("valuesAdded").innerHTML += "</li>";
									}
								}
								if (data.added[i].term_type === "Dx"
										| data.added[i].term_type === "Procedure") {
									if (data.added[i].finding_type !== undefined) {
										document.getElementById("valuesAdded").innerHTML += "<br>finding: "
												+ data.added[i].finding_type;
									}
									if (data.added[i].history !== undefined) {
										document.getElementById("valuesAdded").innerHTML += "<br>history: "
												+ data.added[i].history;
										if (data.added[i].reviewer !== null) {
											document
													.getElementById("valuesAdded").innerHTML += "</li>"
										}
									}
								}
								if (data.added !== null
										&& data.added[i].reviewer !== null
										&& data.added[i].reviewer !== undefined) {
									document.getElementById("valuesAdded").innerHTML += "<br>reviewer: "
											+ data.added[i].reviewer + "</li>";
								}
							}
						}

						if (data.removed !== "No_Data") {
							for ( var i in data.removed) {
								if (data.removed[i].term_selected !== undefined) {
									document.getElementById("valuesRemoved").innerHTML += "<li> term: "
											+ data.removed[i].term_selected;
								}
								if (data.removed[i].term_type !== undefined) {
									document.getElementById("valuesRemoved").innerHTML += "type: "
											+ data.removed[i].term_type;
									if (data.removed[i].reviewer !== null) {
										document
												.getElementById("valuesRemoved").innerHTML += "</li>"
									}
								}
								if (data.removed !== null
										&& data.removed[i].reviewer !== null
										&& data.removed[i].reviewer !== undefined) {
									document.getElementById("valuesRemoved").innerHTML += "<br>reviewer: "
											+ data.removed[i].reviewer
											+ "</li>";
								}
							}
						}
						$('#showAdded').show();
						$('#showRemoved').show();
						$('#msgAdded').hide();
					});
}

function loadFiles() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			html = "<ol>";
			for (i = 0; i < data.length; i++) {
				//console.log(data[i]);
				html += '<li>' + data[i]['fileName'] + '</li>';
			}
			html = html + "</ol>"
			document.getElementById("filesList").innerHTML = html;
		}
	};
	xhttp.open("GET", "http://localhost:8081/files/", true);
	xhttp.send();
}

function loadFls() {
	$.ajax({
		url : '/files',
		type : 'get',
		dataType : 'json',
		success : function(data) {
			//console.log(data);
			var i, html, modal = "";
			html = '<ol>';
			for (i = 0; i < data.length; i++) {
				//console.log(data[i]);
				fileName = data[i]['fileName'].toString()
				// html += '<li><Button onclick="loadDoc(V00000414707_2148)" >' + fileName + '</Button></li>';
				// html+='<li><Button onclick="loadDoc('+"'"+V00000414707_2148+"'"+')">V00000414707_2148</Button></li>';
				html += '<li><a id="\'' + fileName + '\'" onclick=\"loadDoc(\''
						+ fileName + '\')\" href=\"#\">' + fileName
						+ '</a></li>';
			}
			html += '</ol>';
			$("#filesList").html(html);
			//$("#updateresult").html(modal);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			var errorMsg = 'Ajax request failed: ' + xhr.responseText;
			$('#content').html(errorMsg);
		}
	});
}

$(document)
		.ready(
				function() {
					$("input[name='submit']")
							.click(
									function() {
										$('#msg').show();
										$('#container').hide();
										var termSelected = document
												.getElementById("selcontent").innerHTML;
										var find_positive = $(
												"input[id='find_positive']:checked")
												.val();
										var find_negative = $(
												"input[id='find_negative']:checked")
												.val();
										var find_suspect = $(
												"input[id='find_suspect']:checked")
												.val();
										var finding_type = typeof find_positive !== 'undefined' ? "positive"
												: (typeof find_negative !== 'undefined' ? "negative"
														: (typeof find_suspect !== 'undefined' ? "suspected"
																: undefined));
										var heading = $(
												"input[id='heading']:checked")
												.val();
										var dx = $("input[id='dx']:checked")
												.val();
										var procedure = $(
												"input[id='proc']:checked")
												.val();
										var meds = $("input[id='meds']:checked")
												.val();
										var labs = $("input[id='labs']:checked")
												.val();
										var vitals = $(
												"input[id='vital']:checked")
												.val();
										var term_type = typeof heading !== 'undefined' ? heading
												: (typeof dx !== 'undefined' ? dx
														: (typeof procedure !== 'undefined' ? procedure
																: (typeof meds !== 'undefined' ? meds
																		: (typeof labs !== 'undefined' ? labs
																				: (typeof vitals !== 'undefined' ? vitals
																						: undefined)))))
										var history_true = $(
												"input[id='hist_yes1']:checked")
												.val();
										var history_false = $(
												"input[id='hist_no1']:checked")
												.val();
										var history = typeof history_true !== 'undefined' ? "True"
												: "False";
										var isSireeshaChecked = $(
												"input[id='sireesha']:checked")
												.val();
										var reviewer_name = typeof isSireeshaChecked !== 'undefined' ? "Sireesha"
												: "Srinivas";

										console.log('finding_type ',
												finding_type);
										console.log('term_type', term_type);
										console.log('termSelected ',
												termSelected);
										console.log('history ', history);
										console.log('termSelected ',
												termSelected);
										console.log('currentFileName ',
												currentFileName);
										console.log('reviewer_name ',
												reviewer_name);

										var x = document
												.getElementById("updateresult");
										var y = document
												.getElementById("container");
										var z = document
												.getElementById("filesList");
										//x.style.display="block";
										//y.style.width="60%";
										//z.style.display = "block";

										var obj = {
											"term_selected" : termSelected,
											"term_type" : term_type,
											"finding_type" : finding_type,
											"history" : history,
											"file_name" : currentFileName,
											"sentence" : sentence,
											"reviewer_name" : reviewer_name
										}

										$
												.ajax(
														{
															url : '/insert_data',
															type : 'POST',
															data : {
																"obj" : JSON
																		.stringify(obj),
															},
															contentType : "application/x-www-form-urlencoded",
														}).done(function(msg) {
													$('#msg').hide();
													$('#container').show();
													loadDoc(currentFileName);
												});
									})

					$("input[name='remove']")
							.click(
									function() {
										$('#msg').show();
										$('#container').hide();
										var termSelected = document
												.getElementById("selcontent").innerHTML;
										var heading = $(
												"input[id='heading']:checked")
												.val();
										var dx = $("input[id='dx']:checked")
												.val();
										var procedure = $(
												"input[id='proc']:checked")
												.val();
										var meds = $("input[id='meds']:checked")
												.val();
										var labs = $("input[id='labs']:checked")
												.val();
										var vitals = $(
												"input[id='vital']:checked")
												.val();
										var term_type = typeof heading !== 'undefined' ? heading
												: (typeof dx !== 'undefined' ? dx
														: (typeof procedure !== 'undefined' ? procedure
																: (typeof meds !== 'undefined' ? meds
																		: (typeof labs !== 'undefined' ? labs
																				: (typeof vitals !== 'undefined' ? vitals
																						: undefined)))))
										var isSireeshaChecked = $(
												"input[id='sireesha']:checked")
												.val();
										var reviewer_name = typeof isSireeshaChecked !== 'undefined' ? "Sireesha"
												: "Srinivas";
										var y = document
												.getElementById("container");
										var obj = {
											"term_selected" : termSelected,
											"term_type" : term_type,
											"file_name" : currentFileName,
											"sentence" : sentence,
											"reviewer_name" : reviewer_name
										}

										$
												.ajax(
														{
															url : '/remove_data',
															type : 'POST',
															data : {
																"obj" : JSON
																		.stringify(obj),
															},
															contentType : "application/x-www-form-urlencoded",
														})
												.done(
														function(msg) {
															var y = document
																	.getElementById("container");
															y.style.width = "80%";
															$('#msg').hide();
															$('#container')
																	.show();
															loadDoc(currentFileName);
														});
									});
				})

var completedFilesInsertion = function() {
	$('#msg').show();
	$('#container').hide();
	$('#updateresult').hide();
	var obj = {
		file_name : currentFileName,
	}
	$.ajax({
		url : '/completed_files',
		type : 'POST',
		data : {
			"obj" : JSON.stringify(obj),
		},
		contentType : "application/x-www-form-urlencoded",
	}).done(function(msg) {
		$.ajax({
			url : '/remove_completed_files',
			type : 'get',
			dataType : 'json',
			success : function(data) {
				$('#msg').hide();
				$('#container').show();
				window.location.reload();
				;
			},
			error : function(xhr, ajaxOptions, thrownError) {
				var errorMsg = 'Ajax request failed: ' + xhr.responseText;
				$('#content').html(errorMsg);
			}
		});
	});
}

function loadContent(content, type) {
	toggleResultDiv(content)
	var values = document.getElementsByName("type")
	for (var i = 0; i < values.length; i++) {
		values[i].checked = (values[i].value.toLowerCase() === type
				.toLowerCase())
	}
	changeVisibility(type)
}
function loadContentWithDetails(content, type, status, history) {
	toggleResultDiv(content)
	var values = document.getElementsByName("type");
	for (var i = 0; i < values.length; i++) {
		values[i].checked = (values[i].value.toLowerCase() === type
				.toLowerCase())
	}
	changeVisibilityWithValues(type, status, history)
}
