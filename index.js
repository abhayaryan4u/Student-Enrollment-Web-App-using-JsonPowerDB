/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


var jpdbBaseURL = "http://api.login2explore.com:5577";
var connToken = "90931500|-31949303546471489|90960151";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var studDBName = "StudentDB";
var studRelationName = "StudentRelation";

$("#rollno").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj(){
    var rollno = $('#rollno').val();
    var jsonStr = {
        rollno : rollno
    };
    return JSON.stringify(jsonStr);
}

function resetData(){
    $('#rollno').val("");
    $('#studname').val("");
    $('#studclass').val("");
    $('#birthdt').val("");
    $('#addr').val("");
    $('#enrolldt').val("");
    $('#rollno').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#update').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollno').focus();
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studDBName, studRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetData();
    $('#rollno').focus();
}

function updateData(){
    $("#update").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studDBName, studRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetData();
    $('#rollno').focus();
}

function validateData(){
    var rollno, studname, studclass, birthdt, addr, enrolldt;
    rollno=$("#rollno").val();
    studname=$("#studname").val();
    studclass = $("#studclass").val();
    birthdt = $("#birthdt").val();
    addr = $("#addr").val();
    enrolldt = $("#enrolldt").val();
    
    if(rollno === ""){
        alert('Student Roll No Missing');
        $("#rollno").focus();
        return "";
    }
    
    if(studname === ""){
        alert('Student Name Missing');
        $("#studname").focus();
        return "";
    }
    
    if(studclass === ""){
        alert('Student Class Missing');
        $("#studclass").focus();
        return "";
    }
    
    if(birthdt === ""){
        alert('Student Birth Date Missing');
        $("#birthdt").focus();
        return "";
    }
    
    if(addr === ""){
        alert('Student Address Missing');
        $("#addr").focus();
        return "";
    }
    
    if(enrolldt === ""){
        alert('Enrollment Date Missing');
        $("#enrolldt").focus();
        return "";
    }
    
    var jsonStrObj = {
        rollno : rollno,
        name : studname,
        class : studclass,
        birthdate : birthdt,
        address : addr,
        enrollment : enrolldt
    };
    return JSON.stringify(jsonStrObj);
}




function getStudent(){
    var rollnoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studDBName, studRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studname").focus();
    }
    else if(resJsonObj.status === 200){
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);
        
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studname").focus();
    }
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#studname").val(record.name);
    $("#studclass").val(record.class);
    $("#birthdt").val(record.birthdate);
    $("#addr").val(record.address);
    $("#enrolldt").val(record.enrollment);
}



