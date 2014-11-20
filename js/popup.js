/*
	FH_COM_JS v1.0.0
	(c) 2014 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

$(document).ready(function() {

var HtmlMode = 0;

function UpdateLinks() {
	$('a').click(
	   function() {
			fhurl = $(this).attr('href');
			if (fhurl.charAt(0) == '/') {
				fhurl = 'https://freelancehunt.com' + fhurl;
			}
			chrome.tabs.create({url: fhurl});
			return false;
	   }
	);
	
	$('#feed #uad').click(function() {
		ShowUserInfo($(this).attr('for'));
	});
	
	$('#projects #logo').click(function() {
		ShowUserInfo($(this).attr('for'));
	});
}

// ===================================================================================

	$("#refresh,#eloading").click(function() {
		chrome.runtime.sendMessage({method:"Update"}, null);
	});
	
	$("#saveitems").click(function() {
		localStorage.setItem('FID', $('#FID').val());
		localStorage.setItem('FKEY', $('#FKEY').val());
		chrome.runtime.sendMessage({method:"Update"}, null);
		ShowTabId(1);
		Initialize();
	});	
	
	$("#projects #desc").click(function() {
		//JSProject($(this).attr('for'));
	});
	
	$('#user_name').click(function() {
		ShowUserInfo($(this).attr('for'));
		$.UpdateCount();
	});
	
// ===================================================================================

function CheckSettings() {
	var result = true;
	if (localStorage.length == 0) { result = false; } else
	
	if ((localStorage.getItem('FID') == null) || (localStorage.getItem('FKEY') == null)) {
		result = false;
	}
	return result;
}

// ===================================================================================

$('#menu li').click(function() {

	$('#d6').hide();

	$('#menu li').each(function (i, ob) {
		$(ob).removeClass('selected');
		$('[id="' + $(ob).attr('for') + '"]').css('display', 'none');
	});
	
	$(this).addClass('selected');
		$('[id="' + $(this).attr('for') + '"]').css('display', 'block');	
		
	$.UpdateCount();
});
	
	
// ===================================================================================
	
function ShowTabId(id){

	$('#d6').hide();
	
	$('#menu li').each(function (i, ob) {
		$(ob).removeClass('selected');
		$('[id="' + $(ob).attr('for') + '"]').css('display', 'none');
		
		if ((i+1) == id) {
			$(this).addClass('selected');
			$('[id="d' + id + '"]').css('display', 'block');	
		}
	});
}

function NormalizeText(lines) 
	{
	return lines.replace(/\n/g,"<br/>")
				.replace(/\ \ /g," &nbsp;")
				.replace(/"/g,"&quot;")
				.replace(/\$/g,"&#36;");
}
  
// ===================================================================================

function ShowCustomHtml() {

	var profile_id = 0;
	if (localStorage.getItem("PROFILE") != null) {
		var Data = JSON.parse(localStorage.getItem('PROFILE'));
		profile_id = Data.profile_id;	  
	}
	
	// ==========================================================================
	
	if (HtmlMode == 'user') {
	var Data = JSON.parse(localStorage.getItem('TMP'));
	
	var online = '<abbr class="timeago" title="'+ Data.last_activity +'"></abbr>';
	if (Data.is_online ==  true) { var online = 'сейчас на сайте'; }
	
	$('#custom').css('padding', '10px');
	$('#custom').html('<table border="0" id="user_data">'+
					'<tr><td colspan="2"><a href="'+ Data.url +'"><b style="font-size: 16px;">'+Data.fname +' '+ Data.sname + ' ('+ Data.login +')</b></a>'+
					'<span id="flicks2" class="icon-signal" style="float: right">'+ Data.rating +'</span>'+'<br><br></td><tr>'+
					'<tr valign="top"><td width="210px"><img src="'+ Data.avatar.replace('/avatar/50/', '/avatar/225/') +'" class="img-thm" /></td><td>'+ 
					'<b>Возраст:</b> <abbr class="timeago" title="'+ Data.birth_date + '"></abbr><br>'+
					'<b>Вход:</b> '+ online + '<br><br>'+
					'<b>Страна:</b> '+ Data.country_name_ru +'<br>'+
					'<b>Город:</b> '+ Data.city_name_ru +'<br><br>'+
					'<b>Зарегистрирован:</b> <abbr class="timeago" title="'+ Data.creation_date + '"></abbr><br>'+
					'<b>Позиция в общем рейтинге:</b> '+ Data.rating_position +'<br><br>'+
					'<b class="icon-thumbs-up">Отзывы: </b> '  + Data.positive_reviews +'<br>'+
					'<b class="icon-thumbs-down">Отзывы: </b> '+ Data.negative_reviews +'<br>'+
					'</td><tr><tr><td colspan="2"><b>Отправить сообщение</b><br>'+
					'<iframe id="iframe1"></iframe>'+
					'</td><tr></table>');
					
		$('#iframe1').contents().find('html').html(				
		'<style>#uatext { margin: 0px; margin-top: 6px; margin-bottom: 6px; width: 520px; height: 130px; border-radius: 4px; } '+
		'.button{ background: #70baeb; 	border-radius: 4px; font-family: Arial; font-weight: bold; border: 0; padding: 5px; color: White;}'+
		'</style><form action="'+ Data.url_private_message +'" method="post" id="addprivatemessage" enctype="multipart/form-data">'+
    	'<input type="hidden" id="qf:addprivatemessage" name="_qf__addprivatemessage" />'+
		'<textarea id="uatext" name="message"></textarea><input class="button" type="submit" id="sendmessage" value="&nbsp;&nbsp;Отправить&nbsp;&nbsp;"></input></form>');				
	}
	
	// =====================================
	if (HtmlMode == 'message') {
	var Data = JSON.parse(localStorage.getItem('TMP'));
	$('#custom').html('');
	
	$.each(Data, function(key, value){
		
		var obj = JSON.parse(JSON.stringify(value));
		if (obj.from.profile_id == profile_id) { rpos = 'right'; lpos = 'left'; } else { rpos = 'left'; lpos = 'right'; }
	
		$('<div id="msg"><div id="msglogo" style="float: '+rpos+'"><img src="'+obj.from.avatar+'" /></div><div id="msgbody">'+obj.message_html+'</div></div>').appendTo('#custom');
	
	
	
	
	
		});
	}
	
	UpdateLinks();
	jQuery("abbr.timeago").timeago();
}

function ShowUserInfo(Url){
	ShowTabId(6); 
	$('#d6').show();
	$('#custom').html('');
	HtmlMode = 'user';
	$.GetData(Url, 'TMP');	

}

function ShowThreadInfo(Url){
	ShowTabId(6); 
	$('#d6').show();
	$('#custom').html('');
	HtmlMode = 'message';
	$.GetData(Url, 'TMP');	
}

function UpdateUser(){

	if (localStorage.getItem("PROFILE") != null) {
		var Data = JSON.parse(localStorage.getItem('PROFILE'));
		$('#user_name').html(Data.fname+' '+Data.sname);
		$('#flicks').html(Data.rating);	  
	}
}

function UpdateFeeD(){

	if (localStorage.getItem("FEED") != null) {
		var FeedData = JSON.parse(localStorage.getItem('FEED'));
		
		$.each(FeedData, function(key, value){
			var obj = JSON.parse(JSON.stringify(value));
			if (obj.is_new == true) {
			$('<div id="feed_id" class="icon-info"><b><span id="uad" for="https://api.freelancehunt.com/profiles/'+ obj.from.login +'">'+ obj.from.login +'</span> '+obj.message+'</b></div>').appendTo('#feed');
			} else {
			$('<div id="feed_id" class="icon-info"><span id="uad" for="https://api.freelancehunt.com/profiles/'+ obj.from.login +'">'+ obj.from.login +'</span> '+obj.message+'</div>').appendTo('#feed'); }			
		});
	}
}

function UpdateNewMessages(){

	$('#ms').html('');

	if (localStorage.getItem("MS") != null) {
		var FeedData = JSON.parse(localStorage.getItem('MS'));
		
		$.each(FeedData, function(key, value){
			var obj = JSON.parse(JSON.stringify(value));
			
			if (obj.subject == '') obj.subject = 'Тема сообщения не указана.';
			
			$('<div id="thread" class="new_'+obj.is_unread+'" for="'+ obj.url_api+'">'+ // undef or yes
			'<div id="logo">'+
			'<img src="'+ obj.from.avatar +'" /></div>'+ 
			'<div id="title">'+ obj.subject +'</div><span id="umnew">'+ obj.message_count +'</span>'+
			'<div id="desc">'+ obj.from.fname +' '+ obj.from.sname +'</div>'+
			'<div id="info"><span><abbr class="timeago" title="'+ obj.last_post_time +'">...</abbr></span>'+
			'</div></div>').appendTo("#ms");
			
		});
		
	$('#ms #thread').click(function() {
		ShowThreadInfo($(this).attr('for'));
	});	
			
	}
}


// ===================================================================================
	
function Initialize() {

	itsDB = new RegExp("^" + "DB:");

	$('#feed').html('');
	$('#loading').hide();
	$('#eloading').hide();
	$("#projects").html('');
	
	if (CheckSettings() == false) { 
		localStorage.clear();
		ShowTabId(4); 
	}
	
	UpdateUser();
	UpdateFeeD();
	UpdateNewMessages();
	
	for (i = localStorage.length; i > 0; i--) {
		base = localStorage.key(i);
		
		// ==================================================

		if (itsDB.test(base)) {
	
			var Data = JSON.parse(localStorage[base]);
			
			$('<div id="project" class="'+Data.readed+'">'+ // undef or yes
			'<div id="logo" for="'+ Data.from.url_api+'">'+
			'<img src="'+ Data.from.avatar +'" /></div>'+ 
			'<div id="title"><a href="'+ Data.url +'">'+ Data.name +'</a></div>'+
			'<div id="desc" for="'+ Data.project_id +'">'+ Data.description +'</div>'+
			'<div id="info">'+
			'<span><abbr class="timeago" title="'+ Data.publication_time +'">...</abbr></span>'+
			'<span>'+ Data.status_name +'</span>'+
			'</div></div>').appendTo("#projects");
		}
			
    }
		
	jQuery("abbr.timeago").timeago();
	UpdateLinks();
	
}

// ========================================== NOTIFIER ====================

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.method == "Loading"){
		$('#loading').show();
    return true;
  }
	if(message.method == "ELoading"){
		$('#loading').hide();
		$('#eloading').hide();
		
		ShowCustomHtml();
		Initialize();
    return true;
  }
	if(message.method == "ErrorLoading"){
		Initialize();
		$('#eloading').show();
	return true;
  } 
  
});

// ============================== SETTINGS ======================
		
	$("#FID").val(localStorage.getItem('FID'));
	$("#FKEY").val(localStorage.getItem('FKEY'));
	
	Initialize(); 
		
});