/*
	FH_COM_JS v2.0.0 alpha
	(c) 2014 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

/*
	FH_COM_JS v2.0.0 alpha
	(c) 2014 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

var api_prj  = "https://api.freelancehunt.com/projects";
	api_feed = "https://api.freelancehunt.com/my/feed";
	api_mess = "https://api.freelancehunt.com/threads";
	api_prof = "https://api.freelancehunt.com/profiles/me";
	
$(document).ready(function() {

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

	if(message.method == "UpdateCount"){
		$.UpdateCount();
	
		return true;
	}
	
	if(message.method == "Update"){
	
		$.GetData(api_feed, 'FEED');
		$.GetData(api_prof, 'PROFILE');
		$.GetDataVal(api_prj, 'DB');
		$.GetData(api_mess, 'MS');
		
		$.UpdateCount();
	
	return true;
	}
	
	if(message.method == "ELoading"){
		$.UpdateCount();
		return true;
	}
	
});

// First Run App
chrome.runtime.sendMessage({method:"Update"}, null);

});