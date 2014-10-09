/*
	FH_COM_JS v1.0.0
	(c) 2014 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

$(document).ready(function() {

var api_url = "https://api.freelancehunt.com/projects";

function sign(api_token, api_secret, url, method, post_params) {
    var str = CryptoJS.HmacSHA256(url+method+post_params, api_secret);
	return btoa(api_token+':'+btoa(str.toString(CryptoJS.enc.Latin1)));
}

function GenerateToken() {
	var api_token  = localStorage.getItem('fid');   
	var api_secret = localStorage.getItem('fkey'); 

	return sign(api_token, api_secret, api_url, "GET", '');
}

function Update() {

	$.ajax({
		url: api_url,
		type: 'GET',
		dataType: 'json',
		headers: {"Authorization": "Basic "+ GenerateToken()},
		contentType: 'application/json',
		processData: false,
		beforeSend: function(){
			chrome.runtime.sendMessage({method:"Loading"}, null);
        },
		success: function (data) {
		  
		$.each(data, function (key, json) {
			var obj = JSON.parse(JSON.stringify(json));	
			if (localStorage['DB:'+obj.project_id] == undefined) {
			localStorage['DB:'+obj.project_id] = JSON.stringify(json); }
			
			console.log(obj);
		});	
			DeleteExp()
			chrome.runtime.sendMessage({method:"ELoading"}, null);
		},
		error: function(){
			chrome.runtime.sendMessage({method:"ELoading"}, null);
		}
	});
}

function DeleteExp() {
	
	var its = 0;
	itsDB = new RegExp("^" + "DB:");
	
	for(var key in localStorage) {
	if (itsDB.test(key)) {
		
		if (localStorage.length > 23) {
		localStorage.removeItem(key);	
		}
	}
	}
}

function UpdateCount() {

	var itsNew = 0;
	itsDB = new RegExp("^" + "DB:");
		
	for (i = localStorage.length; i > 0; i--) {
		base = localStorage.key(i);
		
		if (itsDB.test(base)) {
			Data = JSON.parse(localStorage[base]);
			
			if (Data.readed == undefined) { itsNew = itsNew + 1; }
		}
    }
	if (itsNew == 0) itsNew = '';
	
	chrome.browserAction.setBadgeText({
		text: ''+itsNew
	});	
}

// ========================================== NOTIFIER ====================

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if(message.method == "UpdateCount"){
		UpdateCount();
	return true;
	}
	if(message.method == "Update"){
		Update();
	return true;
	}
	if(message.method == "ELoading"){
		UpdateCount();
	return true;
	}
});

function CheckSettings() {
	var result = true;
	if ((localStorage.getItem('fid') == undefined) || (localStorage.getItem('fkey') == undefined)) {
		result = false;
	}
	if (localStorage.length == 0) { result = false; }
	return result;
}

if (CheckSettings() == true) { Update(); }

setInterval(function() { 
	chrome.runtime.sendMessage({method:"Update"}, null);
}, 600000);

});