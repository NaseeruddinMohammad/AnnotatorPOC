function toggleResultDiv(conte){
    var x = document.getElementById("updateresult");
    var y = document.getElementById("container");
    var z = document.getElementById("filesList");
    document.getElementById("selcontent").innerHTML=conte;
    if(document.getElementById("selcontent").innerHTML){
            $("button_type").show();
    }
    if (x.style.display === "none" && (conte.toString().length >0)) {
        x.style.display = "block";
        y.style.width="60%";
        z.style.display="block";
    }else if(conte == ""){
        x.style.display = "none";
        y.style.width="80%";
        z.style.display="block";
    }
}

function showFiles(){
    var x= document.getElementById("filesList");
    var y = document.getElementById("container");
    var z = document.getElementById("updateresult");
    if (x.style.display ==="none") {
        x.style.display= "block";
        y.style.display = "block";
        //document.getElementById("filesicon").setAttribute("class","fa fa-arrow-left");
        z.style.display = "none";
    }else{
        //document.getElementById("filesicon").setAttribute("class","fa fa-bars");
        x.style.display= "none";
        y.style.display = "block";
        y.style.width = "100%";
    }
}
var sentence;
function selectionContent() {
    var txt = "";
    if (window.getSelection) {
        txt = window.getSelection();
        if(txt.anchorNode && txt.anchorNode.data !== null)
        sentence = txt.anchorNode.data;
    }
    else if (document.getSelection) {
        txt = document.getSelection();
    } else if (document.selection) {
        txt = document.selection.createRange().text;
    } 
    // alert(txt)
    toggleResultDiv(txt) 
}
function OnChangeRadio(radio) {
    // alert ("The " + radio.value + " radio is selected.");
    changeVisibility(radio.value)
}
function changeVisibility(value){
    if((value === "Dx")||(value === "Procedure")){
        document.getElementById("finding_types").style.display = "block";
        document.getElementById("history_types").style.display = "block";
    }else{
        document.getElementById("finding_types").style.display = "none";
        document.getElementById("history_types").style.display = "none";
    }
}
function changeVisibilityWithValues(value,status,history){
    changeVisibility(value)
    if(status.length !=0){
        var values = document.getElementsByName("finding_types")
        for(var i=0;i<values.length;i++){
        values[i].checked = (values[i].value.toLowerCase() === status.toLowerCase())
        }
    }else{
        document.getElementById("finding_types").style.display = "none";
    }
    var hist_values = document.getElementsByName("history_types")
    for(var i=0;i<hist_values.length;i++){
       hist_values[i].checked = (hist_values[i].value.toLowerCase() === history.toLowerCase())
    }
}

function closeResultOverlay(){
    toggleResultDiv('');
}       
var currentFileName;

function loadDoc(fileName) {
    currentFileName = fileName;
    var myModal = currentFileName +"myModal"
    //console.log('myModal is :: ',myModal)
    document.getElementById("'"+currentFileName+"'").style.color = 'darkblue';
    document.getElementById("fileName").innerHTML += "fileName: " +currentFileName;
    //alert(fileName);
    $.ajax({
        url: '/file_content'+fileName,
        type: 'get',
        success: function(data){
            console.log(data);
            $('#container').HTML(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            $('#content').html(errorMsg);
          }
    });

//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       $('#container').HTML(data);
      
//       // = this.responseText + '<button type="button" class="btn btn-info btn-sm mr-1" data-toggle="modal" data-target =\"#\''+myModal+'\'\">Results</button>'
//                     // +'<input type="button" class="btn btn-info btn-sm" name="completed" onclick="completedFilesInsertion()" value="completed" />';
//     }
//   };
//   xhttp.open("GET", "/file_content/" + fileName, true);
//   xhttp.send();
}
function loadFiles(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        html ="<ol>";
      for (i = 0; i < data.length; i++) {
            //console.log(data[i]);
            html += '<li>' + data[i]['fileName'] + '</li>'; 
       }
        html=html+"</ol>"
        document.getElementById("filesList").innerHTML = html;
    }
  };
  xhttp.open("GET", "http://localhost:8081/files/", true);
  xhttp.send();
}


function loadFls(){
     $.ajax({
                url: '/files',
                type: 'get',
                dataType: 'json',
                success: function(data){
                    //console.log(data);
                    var i, html, modal = "";
                    html  = '<ol>';
                    for (i = 0; i < data.length; i++) {
                        //console.log(data[i]);
                        fileName = data[i]['fileName'].toString()
                        // html += '<li><Button onclick="loadDoc(V00000414707_2148)" >' + fileName + '</Button></li>';
                        // html+='<li><Button onclick="loadDoc('+"'"+V00000414707_2148+"'"+')">V00000414707_2148</Button></li>';
                        html+= '<li><a id="\''+fileName+'\'" onclick=\"loadDoc(\''+fileName+'\')\" href=\"#\">'+fileName+'</a></li>';
                        var valuesAdded = fileName+"valuesAdded";
                        var valuesRemoved = fileName+"valuesRemoved";
                        var myModal = fileName+"myModal'";
                        var showAdded = fileName+"added";
                        var showRemoved = fileName+"removed";
                        modal +=     '<div class="container">'+
                        '<div class="modal fade" id="\''+myModal+'\" role="dialog">'+
                           '<div class="modal-dialog modal-lg">'+
                              '<!-- Modal content-->'+
                              '<div class="modal-content">'+
                                 '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                                 '</div>'+
                                 '<div class="container modal-body">'+
                                    '<div class="row" id=\''+showAdded+'\' style="display: none;">'+
                                       '<div class="col">'+
                                          '<h5>Added:</h5>'+
                                          '<div>'+
                                             '<div id="scroll" class="scrollbar scrollbar-secondary">'+
                                                '<ul id=\''+valuesAdded+'\'></ul>'+
                                             '</div>'+
                                          '</div>'+
                                       '</div>'+
                                       '<div class="col" id=\''+showRemoved+'\' style="display: none;">'+
                                          '<h5>Removed:</h5>'+
                                          '<div>'+
                                             '<div id="scroll" class="scrollbar scrollbar-secondary">'+
                                                '<ul id=\''+valuesRemoved+'\'></ul>'+
                                             '</div>'+
                                          '</div>'+
                                       '</div>'+
                                    '</div>'+
                                 '</div>'+
                                 '<div class="modal-footer">'+
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                                 '</div>'+
                              '</div>'+
                           '</div>'+
                        '</div>'+
                     '</div>';
                    }
                    html += '</ol>';
                    $("#filesList").html(html);
                    $("#modals").html(modal);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var errorMsg = 'Ajax request failed: ' + xhr.responseText;
                    $('#content').html(errorMsg);
                  }
            });
}

//function getData(){
    $(document).ready(function(){
        $("input[name='submit']").click(function(){
            $('#msg').show();
            $('#container').hide();
            var termSelected = document.getElementById("selcontent").innerHTML;
            var find_positive = $("input[id='find_positive']:checked").val();
            var find_negative = $("input[id='find_negative']:checked").val();
            var find_suspect = $("input[id='find_suspect']:checked").val();
            var finding_type = typeof find_positive !== 'undefined' ? "positive" : (typeof find_negative !== 'undefined' ? "negative" : (typeof find_suspect !== 'undefined' ? "suspected" : undefined));
            var heading     = $("input[id='heading']:checked").val();
            var dx          = $("input[id='dx']:checked").val();
            var procedure   = $("input[id='proc']:checked").val();
            var meds        = $("input[id='meds']:checked").val();
            var labs        = $("input[id='labs']:checked").val();
            var vitals          = $("input[id='vital']:checked").val();
            var term_type = typeof heading !== 'undefined' ? heading : (typeof dx !== 'undefined' ? dx : (typeof procedure !== 'undefined' ? procedure : (typeof meds !== 'undefined' ? meds : (typeof labs !== 'undefined' ? labs : (typeof vitals !== 'undefined' ? vitals : undefined)))))
            var history_true = $("input[id='hist_yes']:checked").val();
            var history_false = $("input[id='hist_no']:checked").val();
            var history = typeof history_true !== 'undefined' ? "True" : "False";
            console.log('finding_type ',finding_type);
            console.log('term_type', term_type);
            console.log('termSelected ', termSelected);
            console.log('history ', history);
            console.log('termSelected ', termSelected);
            console.log('currentFileName ', currentFileName);
            
            var x = document.getElementById("updateresult");
            var y = document.getElementById("container");
            var z = document.getElementById("filesList");
            x.style.display="none";
            y.style.width="80%";
            z.style.display = "block";

            var obj =  { 
                "term_selected" : termSelected,
                "term_type" :  term_type,  
                "finding_type" :  finding_type,
                "history" : history,
                "file_name" : currentFileName,
                "sentence" : sentence
            }
            $.ajax({
                url: '/insert_data',
                type: 'POST',
                data: {
                    "obj": JSON.stringify(obj),
                     },
                contentType: "application/x-www-form-urlencoded",
            }).done(function( msg ) {
                var showAdded = "#"+currentFileName+"added";
                $(showAdded).show();
                var added = currentFileName+"valuesAdded";
                if(termSelected !== undefined){
                    document.getElementById(added).innerHTML += "<li> term: "+termSelected; 
                }
                if(term_type !== undefined){
                    document.getElementById(added).innerHTML += "type: "+term_type;
                    if(term_type === "meds" | term_type === "labs" | term_type === "vitals"){
                        document.getElementById(added).innerHTML += "</li>";    
                    }
                }

                if(term_type === "dx" | term_type === "procedure"){
                    if(finding_type !== undefined){
                        document.getElementById(added).innerHTML += "<br>finding: "+finding_type;
                    }
                    if(history !== undefined){
                        document.getElementById(added).innerHTML += " history: "+history +"</li>";    
                    }    
                }
                        
                $('#msg').hide();
                $('#container').show();
              });
    })

    $("input[name='remove']").click(function(){
        $('#msg').show();
        $('#container').hide();
        var termSelected = document.getElementById("selcontent").innerHTML;
        var heading     = $("input[id='heading']:checked").val();
            var dx          = $("input[id='dx']:checked").val();
            var procedure   = $("input[id='proc']:checked").val();
            var meds        = $("input[id='meds']:checked").val();
            var labs        = $("input[id='labs']:checked").val();
            var vitals          = $("input[id='vital']:checked").val();
            var term_type = typeof heading !== 'undefined' ? heading : (typeof dx !== 'undefined' ? dx : (typeof procedure !== 'undefined' ? procedure : (typeof meds !== 'undefined' ? meds : (typeof labs !== 'undefined' ? labs : (typeof vitals !== 'undefined' ? vitals : undefined)))))
            var y = document.getElementById("container");
            var obj = {
                term_selected : termSelected,
                term_type :  term_type,
                file_name : currentFileName,
                sentence : sentence
            }

            $.ajax({
                url: '/remove_data',
                type: 'POST',
                data: {
                    "obj": JSON.stringify(obj),
                     },
                contentType: "application/x-www-form-urlencoded",
            }).done(function( msg ) {
                var y = document.getElementById("container");
                y.style.width="80%";
                $('#msg').hide();
                $('#container').show();
                var showRemoved = "#"+currentFileName+"removed";
                $(showRemoved).show();
                var removed = currentFileName+"valuesRemoved"

                if(termSelected !== undefined){
                    document.getElementById(removed).innerHTML += "<li> term: "+termSelected; 
                }
                if(term_type !== undefined){
                    document.getElementById(removed).innerHTML += " type: "+term_type+"</li>";
                }   
                $('#msg').hide();
                $('#container').show();
                $('#updateresult').hide();
              });
    });
})

    var completedFilesInsertion = function(){
        $('#msg').show();
        $('#container').hide();
            var obj = {
                file_name : currentFileName,
            }
            $.ajax({
                url: '/completed_files',
                type: 'POST',
                data: {
                    "obj": JSON.stringify(obj),
                     },
                contentType: "application/x-www-form-urlencoded",
            }).done(function( msg ) {
                $.ajax({
                    url: '/view_completed',
                    type: 'get',
                    dataType: 'json',
                    success: function(data){    
                        $('#msg').hide();
                        $('#container').show();
                        window.location.reload();;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var errorMsg = 'Ajax request failed: ' + xhr.responseText;
                        $('#content').html(errorMsg);
                      }
                });
              });
    }

function loadContent(content,type){
    toggleResultDiv(content)
    var values = document.getElementsByName("type")
    for(var i=0;i<values.length;i++){
       values[i].checked = (values[i].value.toLowerCase() === type.toLowerCase())
    }
   changeVisibility(type)
}
function loadContentWithDetails(content,type,status,history){
    toggleResultDiv(content)
    var values = document.getElementsByName("type");
    for(var i=0;i<values.length;i++){
       values[i].checked = (values[i].value.toLowerCase() === type.toLowerCase())
    }
   changeVisibilityWithValues(type,status,history)
}
