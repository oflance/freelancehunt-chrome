/*
	FH_COM_JS v3.0
	(c) 2014-2015 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

// ========================================================
	
(function($){
	
	$.sign = function(api_token, api_secret, url, method, post_params) {
		var str = CryptoJS.HmacSHA256(url+method+post_params, api_secret);
		return btoa(api_token+':'+btoa(str.toString(CryptoJS.enc.Latin1)));
	},
	
	$.GenerateToken = function(Jurl) {
		var api_token  = localStorage.getItem('FID'); 
		var api_secret = localStorage.getItem('FKEY'); 
		return this.sign($.trim(api_token), $.trim(api_secret), Jurl, "GET", '');
	},
	
    $.GenerateTokenPOST = function(Jurl, post_params) {
        var api_token  = localStorage.getItem('FID'); 
        var api_secret = localStorage.getItem('FKEY'); 
        return this.sign($.trim(api_token), $.trim(api_secret), Jurl, "POST", post_params);
    },
	
	$.SendData = function(Url, msg) {
		
	var JsData = JSON.stringify({"message": msg});
		
	$.ajax({
		url: Url,
		type: 'POST',
		headers: {"Authorization": "Basic "+ $.GenerateTokenPOST(Url, JsData)},
		contentType: 'application/json; charset=utf-8',
		data: JsData,
		beforeSend: function(){
			chrome.runtime.sendMessage({method:"Loading"}, null);
        },
		success: function (data) {	
			chrome.runtime.sendMessage({method:"SLoading"}, null);
		},
		error: function(){
			chrome.runtime.sendMessage({method:"ELoading"}, null);
			chrome.runtime.sendMessage({method:"ErrorLoading"}, null);
			}
		});
	},
	
	$.GetData = function(Url, JName) {
	$.ajax({
		url: Url,
		type: 'GET',
		dataType: 'json',
		headers: {"Authorization": "Basic "+ this.GenerateToken(Url)},
		contentType: 'application/json',
		processData: false,
		beforeSend: function(){
			chrome.runtime.sendMessage({method:"Loading"}, null);
        },
		success: function (data) {		
			localStorage.removeItem(JName);
			localStorage.setItem(JName, JSON.stringify(data));
			chrome.runtime.sendMessage({method:"ELoading"}, null);
		},
		error: function(){
			chrome.runtime.sendMessage({method:"ELoading"}, null);
			chrome.runtime.sendMessage({method:"ErrorLoading"}, null);
			}
		});
	},
	
	$.GetDataVal = function(Url, JName) {
	$.ajax({
		url: Url,
		type: 'GET',
		dataType: 'json',
		headers: {"Authorization": "Basic "+ this.GenerateToken(Url)},
		contentType: 'application/json',
		processData: false,
		beforeSend: function(){
			chrome.runtime.sendMessage({method:"Loading"}, null);
        },
		success: function (data) {

			$.each(data, function (key, json) {
				var obj = JSON.parse(JSON.stringify(json));	
				if (localStorage[JName+':'+obj.project_id] == undefined) {
				localStorage[JName+':'+obj.project_id] = JSON.stringify(json); }
			});
			
			$.DeleteExp();
			chrome.runtime.sendMessage({method:"ELoading"}, null);
		},
		error: function(){
			chrome.runtime.sendMessage({method:"ELoading"}, null);
			chrome.runtime.sendMessage({method:"ErrorLoading"}, null);
			}
		});
	},	
	
	$.DeleteExp = function() {
		
		var its = 0;
		itsDB = new RegExp("^" + "DB:");
		
		for (i = localStorage.length; i >= 0; i--) {
			base = localStorage.key(i);
			
			if (itsDB.test(base)) {
				its += 1; 
				
				if (its > 20) { // C 0 - позиции ...
					localStorage.removeItem(base);	
				}
			}
		}
		
	},

	$.MSCount = function() {
	
		var mcount = 0;
		if (localStorage.getItem("MS") != null) {
			var FeedData = JSON.parse(localStorage.getItem('MS'));
		
		$.each(FeedData, function(key, value){
			var obj = JSON.parse(JSON.stringify(value));
		
				if (obj.is_unread == true){
					mcount++;
				}		

			});
		}
		return mcount;
	},
	
	$.UpdateCount = function() {
		
		var mscount = this.MSCount();
		
		itsDB = new RegExp("^" + "DB:");
		var count = 0;
		for(i = 0; i <= localStorage.length; i++){ 
			if (itsDB.test(localStorage.key(i))) {
				
				var Data = JSON.parse(localStorage[localStorage.key(i)]);
				if (Data.readed != true) { count++; }
				
			}
		}
		
		if (localStorage.getItem('ME_OFF') == null) { 
			chrome.browserAction.setIcon({ path: 'images/icon.png' });
		} else {
			chrome.browserAction.setIcon({ path: 'images/icon_dis.png' });
		}
		
		if (count == 0) count = '';
		
		if (mscount > 0) {
			chrome.browserAction.setBadgeBackgroundColor({ color: [0, 128, 255, 255] });
			count = mscount;
		} else {
			chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 83, 255] }); 
		}
		
		if (localStorage.getItem('ME_OFF') == null) {
			chrome.browserAction.setBadgeText({ text: ''+count });		
		} else {
			chrome.browserAction.setBadgeText({text: ''}); } 
	}
	
})( jQuery );