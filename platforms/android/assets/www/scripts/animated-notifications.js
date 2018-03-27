$(window).load(function () {


	/*
function resize(){$('#notifications').height(window.innerHeight - 50);}
$( window ).resize(function() {resize();});
resize();
*/

function refresh_close(){
$('.close').click(function(){$(this).parent().fadeOut(200);});
}
refresh_close();




var top = '<div id="notifications-top-center" >Oops, something went wrong !<div id="notifications-top-center-close" class="close localizejs"><span class="ion-close-round" ></span></div></div>';





$('#notifications-window-row-button').click(function(){


    $("#notifications-top-center").remove();
	$("#Error_Message").append(top);
	$("#notifications-top-center").addClass('animated ' + 'bounce');
	refresh_close();


});



});
