/*
	FH_COM_JS v3.0
	(c) 2014-2015 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

$(document).ready(function() {

// ======================== NAVIGATION ====================================

var WorkMode = '';
var Th_Url = "https://api.freelancehunt.com/threads/";

function SetAllReaded() {
	
	itsDB = new RegExp("^" + "DB:");

	for (i = localStorage.length; i >= 0; i--) {
		base = localStorage.key(i);
		
		if (itsDB.test(base)) {
			var Data = JSON.parse(localStorage[base]);
			Data.readed = true;
			localStorage[base] = JSON.stringify(Data);
		}	
    }
	$.UpdateCount();
}

function HideAllDiv(){
	$('#container .idiv').each(function (i, ob) {
		$(ob).css('display', 'none');
	});
	
	$('#menu li').each(function (i, ob) { $(ob).removeClass('selected'); });
}

function ShowStats(){
	
	if (localStorage.getItem("RATINGS") != null) {
		
		$("#graph > tbody").html("");
		$("#graph > thead").html("");
		$(".visualize-bar").remove();
		
		var tbody = $('#graph tbody');
		var thead = $('#graph thead');
		
		var tr = $('<tr>'); var th = $('<tr>');
		
		$.each(JSON.parse(localStorage["RATINGS"]), function(i, reservation) {
		  
		  var date = new Date(reservation['date'])
		  
		  $('<th>'+ date.getDate() +'-'+ (date.getMonth() + 1) +'-'+ date.getFullYear() +'</th>').appendTo(th);
		  $('<td>'+ reservation['rating'] +'</td>').appendTo(tr);
		  
		});

		thead.append(th); tbody.append(tr);		
	
		$('#graph').visualize({type: 'bar'});
	}
}

$('#filter,#flicks').unbind().click(function() {
	HideAllDiv();
	LoadSkills();
	
	$($(this).attr('for')).css('display', 'block').animate({"scrollTop":0},"fast");
	if ($(this).attr('for') == '#id_fk') { ShowStats(); }
});

if (localStorage.getItem('ME_OFF') == null) { $('#me_off').removeClass('off'); } else { $('#me_off').addClass('off');}

$('#me_off').unbind().click(function() {
	
	if (localStorage.getItem('ME_OFF') == null) {
		localStorage.setItem('ME_OFF', 'TRUE');
		$(this).addClass('off');
		$.UpdateCount();
	} else { 
		localStorage.removeItem('ME_OFF'); 
		$(this).removeClass('off');
		$.UpdateCount();
	}
	
	$($(this).attr('for')).css('display', 'block').animate({"scrollTop":0},"fast");
});

$('#menu li').unbind().click(function() {

	HideAllDiv();
	
	if ($(this).attr('for') == 'id_pj') { SetAllReaded(); }
	
	$(this).addClass('selected');	
	$('[id="' + $(this).attr('for') + '"]').css('display', 'block').animate({"scrollTop":0},"fast");
	
});

function LoadSkills(){
	
	$('#id_fl #data').html('');
	var Data = JSON.parse(localStorage.getItem('SKL'));
	
	$.each(Data, function(key, value){
		
		var obj = JSON.parse(JSON.stringify(value));	
		
		if (localStorage.getItem('ME_SKL') == null) { checker = ""; } else {
		if (localStorage.getItem('ME_SKL').indexOf(obj.skill_id + ",") >= 0) {checker = "checked";} else { checker = ""; }}
		
		$('<div id="blk"><input type="checkbox" class="chb" id="'+ obj.skill_id +'" name="'+ obj.skill_id +'" ' +checker +' />'+
		'<label for="'+ obj.skill_id +'" class="clabel">'+ obj.skill_name +'</label></div>').appendTo('#id_fl #data');
		
	});
	
	$( "#id_fl #data .chb" ).unbind().change(function() {  
		var skills = '';	  
		$('#id_fl #data input:checked').each(function() {
			skills += $(this).attr('name') + ',';
		}); 
		localStorage.setItem('ME_SKL', skills);
	});
}

// ======================== END NAVIGATION ====================================

$("#refresh,#eloading").unbind().click(function() {
	chrome.runtime.sendMessage({method:"Update"}, null);
});

$("#saveitems").unbind().click(function() {
	localStorage.setItem('FID', $('#FID').val());
	localStorage.setItem('FKEY', $('#FKEY').val());
	chrome.runtime.sendMessage({method:"Update"}, null);
	Initialize();
});	

function CheckSettings() {
	var result = true;
	if (localStorage.length == 0) { result = false; } else
	
	if ((localStorage.getItem('FID') == null) || (localStorage.getItem('FKEY') == null)) {
		result = false;
	}
	return result;
}

// ========================================== INITIALIZE ==================

function UpdateLinks() {
	
	$('a').unbind().click(
	   function() {
			fhurl = $(this).attr('href');
			if (fhurl.charAt(0) == '/') {
				fhurl = 'https://freelancehunt.com' + fhurl;
			}
			chrome.tabs.create({url: fhurl});
			return false;
	   }
	);
	
	$('#id_fd #uad, #id_pj #logo, #u_name').unbind().click(function() {
		ShowUserInfo($(this).attr('for'));
	});

}

function ShowUserInfo(Url){
	WorkMode = 'US';
	$.GetData(Url, 'TMP');
}

function ShowThreadInfo(Url){
	WorkMode = 'MS';
	$.GetData(Url, 'TMP');
}

function blink(elem, times, speed) {
    if (times > 0 || times < 0) {
        if ($(elem).hasClass("blink")) {
            $(elem).removeClass("blink");
			$(elem).focus(); }
        else
            $(elem).addClass("blink");
    }

    clearTimeout(function () {
        blink(elem, times, speed);
    });

    if (times > 0 || times < 0) {
        setTimeout(function () {
            blink(elem, times, speed);
        }, speed);
        times -= .5;
    }
}

function SendNewMessage(){
	if ($.trim($('#msg_text').val()) == ""){
		blink('#msg_text', 2, 200);
	} else {
		$.SendData(Th_Url+$('#thread_id').val(), $('#msg_text').val());
		$('#msg_text').val('');	
	}
}

$('#msg_send').unbind().click(function() {
	SendNewMessage();
});

$('#msg_text').unbind().keydown(function (e) {

  if (e.ctrlKey && e.keyCode == 13) {
    SendNewMessage();
  }
  
});
		
function ShowCustomHtml() {
	
	var profile_id = 0;
	if (localStorage.getItem("PROFILE") != null) {
		var Data = JSON.parse(localStorage.getItem('PROFILE'));
		profile_id = Data.profile_id;	  
	}
		
	if (WorkMode == 'US') {
	
	HideAllDiv();
	$('#id_us').css('display', 'block');
	
	var Data = JSON.parse(localStorage.getItem('TMP'));
	
	var online = '<abbr class="timeago" title="'+ Data.last_activity +'"></abbr>';
	if (Data.is_online ==  true) { var online = 'сейчас на сайте'; }
	
	$('#id_us #data').css('padding-left', '10px').html('<table border="0" id="user_data">'+
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
					
		$('.img-thm').error(function() {
			var ImSrc = $(this).attr('src');
			$(this).attr('src', ImSrc.replace('/avatar/225/', '/avatar/50/'));
		});
					
		$('#iframe1').contents().find('html').html(				
		'<style>#uatext { margin: 0px; margin-top: 6px; margin-bottom: 6px; width: 520px; height: 130px; border-radius: 4px; } '+
		'.button{ background: #70baeb; 	border-radius: 4px; font-family: Arial; font-weight: bold; border: 0; padding: 5px; color: White;}'+
		'</style><form action="'+ Data.url_private_message +'" method="post" id="addprivatemessage" enctype="multipart/form-data">'+
    	'<input type="hidden" id="qf:addprivatemessage" name="_qf__addprivatemessage" />'+
		'<textarea id="uatext" name="message"></textarea><input class="button" type="submit" id="sendmessage" value="&nbsp;&nbsp;Отправить&nbsp;&nbsp;"></input></form>');	

		WorkMode = '';
	}
	
	if (WorkMode == 'MS') {
		
	HideAllDiv();
	$('#id_ms_thr').css('display', 'block');
	
		var Data = JSON.parse(localStorage.getItem('TMP'));
		$('#id_ms_thr #data #msg_feed').html('');
		
		$.each(Data, function(key, value){
			
			var obj = JSON.parse(JSON.stringify(value));
			if (obj.from.profile_id == profile_id) { rpos = 'right'; lpos = 'left'; } else { rpos = 'left'; lpos = 'right'; }
		
			$('<div id="msg"><div id="msglogo" style="float: '+rpos+'"><img src="'+obj.from.avatar+'" /></div><div id="msgbody" class="chat chat-'+
			rpos+'">'+obj.message_html+'</div></div>').appendTo('#id_ms_thr #data #msg_feed');
		
			});
			
		$('#id_ms_thr #data #msg_feed img').each(function(){
			var src = $(this).attr('src')
			if (src.charAt(0) == '/') {
				src = 'https:' + src;
			}
			$(this).attr('src', src);
		});
	
	$("#msg_feed").animate({ scrollTop: $('#msg_feed')[0].scrollHeight}, 500);
	WorkMode = '';
	}	
}
	
function UpdateUser(){
	if (localStorage.getItem("PROFILE") != null) {
		var Data = JSON.parse(localStorage.getItem('PROFILE'));
		$('#u_name').html(Data.fname+' '+Data.sname);
		$('#flicks').html(Data.rating);	  
				
		if (localStorage.getItem("RATINGS") == null) {
			var param = [];
			param.push({"date":$.now(), "rating":Data.rating});		
			localStorage["RATINGS"] = JSON.stringify(param);
			
		} else {
			
			var storedNames = [];
			storedNames = JSON.parse(localStorage["RATINGS"]);				
			if (storedNames[storedNames.length - 1]['rating'] != Data.rating) {
				storedNames.push({"date":$.now(), "rating":Data.rating});		
			}	
			localStorage["RATINGS"] = JSON.stringify(storedNames);
		} 	
	}
}

function ShowMSCount(){
	var count = $.MSCount();	
	if (count == 0){ $('#umnew2').hide();
	} else { $('#umnew2').html(count).show(); }	
}

// ===========================================================

function UpdateNewMessages(){

	$('#id_ms #data').html('');

	if (localStorage.getItem("MS") != null) {
		var FeedData = JSON.parse(localStorage.getItem('MS'));
		
		$.each(FeedData, function(key, value){
			var obj = JSON.parse(JSON.stringify(value));
			
			if (obj.subject == '') obj.subject = 'Тема сообщения не указана.';
			
			$('<div id="thread" class="new_'+obj.is_unread+'" for="'+ obj.url_api+'" value="'+ obj.thread_id +'">'+ // undef or yes
			'<div id="logo">'+
			'<img src="'+ obj.from.avatar +'" /></div>'+ 
			'<div id="mstitle">'+ obj.subject +'</div><span id="umnew">'+ obj.message_count +'</span>'+
			'<div id="msdesc">'+ obj.from.fname +' '+ obj.from.sname +'</div>'+
			'<div id="info"><span><abbr class="timeago" title="'+ obj.last_post_time +'">...</abbr></span>'+
			'</div></div>').appendTo("#id_ms #data");
			
		});
		
	$('#id_ms #thread').unbind().click(function() {
		ShowThreadInfo($(this).attr('for'));
		
		$('#thread_id').val($(this).attr('value'));
	});	
			
	}
}

// ===========================================================

function UpdateFeeD(){

	if (localStorage.getItem("FEED") != null) {
		var FeedData = JSON.parse(localStorage.getItem('FEED'));
		
		$('#id_fd #data').html('');
		
		$.each(FeedData, function(key, value){
			var obj = JSON.parse(JSON.stringify(value));
				
			$('<div id="feed_id" class="icon-info i'+ obj.is_new +'"><span id="uad" for="https://api.freelancehunt.com/profiles/'+ obj.from.login +'">'+ 
			obj.from.login +'</span> '+obj.message+'</div>').appendTo('#id_fd #data');
						
		});
		
		$('#id_fd img').each(function(){
			var src = $(this).attr('src')
			if (src.charAt(0) == '/') {
				if (src.indexOf("//") != -1) {
				src = 'https:' + src;	
				} else {
				src = 'https://freelancehunt.com' + src; }
			}
			$(this).attr('src', src);
		});
	
	}
}

// ===========================================================

function Initialize() {

	itsDB = new RegExp("^" + "DB:");

	$('#loading').hide();
	$('#eloading').hide();
	$("#id_pj #data").html('');
	
	if (CheckSettings() == false) { 
		localStorage.clear();
		HideAllDiv();
		$("#id_st").css('display', 'block');
	}
	
	UpdateUser();
	UpdateFeeD();
	UpdateNewMessages();
	
	for (i = localStorage.length; i >= 0; i--) {
		base = localStorage.key(i);
		
		// ==================================================
		
		if (itsDB.test(base)) {
	
			var budjet = '';
			var Data = JSON.parse(localStorage[base]);
			
			if (Data.budget_amount !== undefined) {
				budjet = Data.budget_amount +' '+Data.budget_currency_code;
			}
			
			
			$('<div id="project" class="'+Data.readed+'">'+ // undef or yes
			'<div id="logo" for="'+ Data.from.url_api+'">'+
			'<img src="'+ Data.from.avatar +'" /></div>'+ 
			'<div id="title"><a href="'+ Data.url +'">'+ Data.name +'</a><span class="uprice">'+ budjet +'</span></div>'+
			'<div id="desc" for="'+ Data.project_id +'">'+ Data.description +'</div>'+'<div id="info">'+
			'<span><abbr class="timeago" title="'+ Data.publication_time +'">...</abbr></span>'+
			'<span>'+ Data.status_name +'</span>'+
			'<span>Ставок: '+ Data.bid_count +'</span>'+
			'</div></div>').appendTo("#id_pj #data");
	
		}
    }
	
	ShowMSCount();
	jQuery("abbr.timeago").timeago();
	UpdateLinks();
}

// ========================================== NOTIFIER ====================

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.method == "Loading"){
		$('#loading').show();
    return true;
  }
	if(message.method == "SLoading"){
		$('#loading').hide();
		$('#eloading').hide();
	
		WorkMode = '';
		ShowThreadInfo(Th_Url+$('#thread_id').val());	
		
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

// ========================================== SETTINGS ======================
		
	$("#FID").val(localStorage.getItem('FID'));
	$("#FKEY").val(localStorage.getItem('FKEY'));
	
	
	$("#FID, #FKEY").change(function() {
		localStorage.setItem('FID', $('#FID').val());
		localStorage.setItem('FKEY', $('#FKEY').val());			
	});
		
	Initialize(); 
		
// ==========================================================================

});