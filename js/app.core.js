/*
	FH_COM_JS v2.0.0 alpha
	(c) 2014 by Vaskevych. All rights reserved.
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
			chrome.runtime.sendMessage({method:"ELoading"}, null);
			localStorage.removeItem(JName);
			localStorage.setItem(JName, JSON.stringify(data));
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
		
		for (i = localStorage.length; i > 0; i--) {
			base = localStorage.key(i);
			
			if (itsDB.test(base)) {
				its += 1; 
				
				if (its > 18) {
					localStorage.removeItem(base);	
				}
			}
		}
		
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
	
	$.UpdateCount = function() {
	
		var its = 0;
		itsDB = new RegExp("^" + "DB:");
		
		for (i = localStorage.length; i > 0; i--) {
			base = localStorage.key(i);
			
			if (itsDB.test(base)) {
				its += 1; 
			}
		}
		
		if (its == 0) its = '';
		
		chrome.browserAction.setBadgeText({
			text: ''+its
		});	
			
	}
	
})( jQuery );