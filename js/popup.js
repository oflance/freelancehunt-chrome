/*
	FH_COM_JS v1.0.0
	(c) 2014 by Vaskevych. All rights reserved.
	http://freelancehunt.com/freelancer/Vaskevych.html
*/

$(document).ready(function() {

$("#toolbar span").click(function() {
	loader(this.id);
});

function loader(run) {	
	switch(run)
	{
		case 'btn_back':
			$('#settings, #prj, #btn_back, #about').hide();
			$('#projects, #btn_update').show();
			Initialize();
		break;
	
		case 'btn_prj':
			$('#settings, #projects, #btn_update, #about').hide();
			$('#prj, #btn_back').show();
		break;
	
		case 'btn_settings':
			$('#prj, #projects, #btn_update, #btn_back, #about').hide();
			$('#btn_save, #settings').show();
		break;
		
		case 'btn_about':
			$('#settings, #prj, #btn_save, #projects, #btn_update').hide();
			$('#about, #btn_back').show();
		break;
		
		case 'btn_save':
			$('#settings, #prj, #btn_save, #btn_back, #about').hide();
			$('#projects, #btn_update').show();
			chrome.runtime.sendMessage({method:"Update"}, null);
		break;
		
		case 'btn_close':
			window.close();
		break;
		
		case 'btn_update':
			chrome.runtime.sendMessage({method:"Update"}, null);
		break;
		
		default:
		break;
	}
}

// ========================================== NOTIFIER ====================

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.method == "Loading"){
		$('#loading').show();
    return true;
  }
	if(message.method == "ELoading"){
		$('#loading').hide();
		Initialize();
    return true;
  }
});

function UpdateLinks() {
	$('a').click(
	   function() {
		   chrome.tabs.create({url: $(this).attr('href')});
		   return false;
	   }
	);
}

function NormalizeText(lines) 
	{
	return lines.replace(/\n/g,"<br/>")
				.replace(/\ \ /g," &nbsp;")
				.replace(/"/g,"&quot;")
				.replace(/\$/g,"&#36;");
}
  
function JSProject(project_id) {

	loader('btn_prj');	
	chrome.runtime.sendMessage({method:"UpdateCount"}, null);

	var Data = JSON.parse(localStorage['DB:'+project_id]);
	
	Data.readed = "readed";
	localStorage['DB:'+project_id] = JSON.stringify(Data);
	
	var Skills = ''; 
	for (var key in Data.skills) {
		Skills += '<span>'+ Data.skills[key] +'</span>';
	}
	
	$("#prj").html('');
	$('<table><tr><td valign="top" width="50px">'+
	'<div id="logo"><a href="http://freelancehunt.com/employer/'+ Data.from.login +'.html"><img src="'+ Data.from.avatar +'" /></a></div>'+
	'</td><td><div id="title"><br><a href="'+ Data.url +'">'+ Data.name +'</a><br><br></div>'+
	'<div id="udesc">'+ NormalizeText(Data.description) +'<br><br>'+
	'<div id="info"><span>'+ Data.status_name +'</span></div><br>'+
	'<i class="icons ic1"></i>Начало: <abbr class="timeago" title="'+ Data.publication_time +'">...</abbr>&nbsp;&nbsp;'+
	'<i class="icons ic1"></i>Окончание: <abbr class="timeago" title="'+ Data.expire_time +'">...</abbr><br>'+	
	'<div id="tags">'+ Skills +'</div>'+
	'</div></td></tr></table>').appendTo("#prj");
	
	jQuery("abbr.timeago").timeago();
	UpdateLinks();
}
	
function Initialize() {

	itsDB = new RegExp("^" + "DB:");

	$('#loading').hide();
	$("#projects").html('');
	
	for (i = localStorage.length; i > 0; i--) {
		base = localStorage.key(i);

		if (itsDB.test(base)) {
	
			var Data = JSON.parse(localStorage[base]);
			
			console.log(Data);
			
			$('<div id="project" class="'+Data.readed+'">'+ // undef or yes
			'<div id="logo" for="'+ Data.from.login +'"><a href="http://freelancehunt.com/employer/'+ Data.from.login +'.html">'+
			'<img src="'+ Data.from.avatar +'" /></a></div>'+ 
			'<div id="title"><a href="'+ Data.url +'">'+ Data.name +'</a></div>'+
			'<div id="desc" for="'+ Data.project_id +'">'+ Data.description +'</div>'+
			'<div id="info">'+
			'<span><abbr class="timeago" title="'+ Data.publication_time +'">...</abbr></span>'+
			'<span>'+ Data.status_name +'</span>'+
			'</div></div>').appendTo("#projects");
	
		}
    }
	
	$("#projects #desc").click(function() {
		JSProject($(this).attr('for'));
	});
		
	chrome.runtime.sendMessage({method:"UpdateCount"}, null);

	jQuery("abbr.timeago").timeago();
	UpdateLinks();
}

function CheckSettings() {
	var result = true;
	if (localStorage.length == 0) { result = false; } else
	if ((localStorage.getItem('fid') == undefined) || (localStorage.getItem('fkey') == undefined)) {
		result = false;
	}
//	if (typeof localStorage !== "undefined") { result = true;} else { result = false;}
	return result;
}

// ============================== SETTINGS ======================

	$("#fr_id").change(function() {
		localStorage.setItem('fid', $("#fr_id").val());  
	});

	$("#fr_key").change(function() {
		localStorage.setItem('fkey', $("#fr_key").val());
	});
		
	$("#fr_id").val(localStorage.getItem('fid'));
	$("#fr_key").val(localStorage.getItem('fkey'));
	
if (CheckSettings() == false) { loader('btn_settings'); } else { 
	Initialize(); 
}
	
});