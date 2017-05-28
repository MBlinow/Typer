
$(document).ready(function(){
	timeLimit=500;
	$('#TopPane').text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
	$("#Timer").text('Time: ' +timeLimit);
	waitToStart();
	
});

function waitToStart(){
	WaitInterval= setInterval(waitCheck, 50)
	fieldlength=0;
	//while (fieldlength<50){
	//	fieldlength= $("#TextBox").val().length;
	//	$('#length').text('Characters entered:'+fieldlength);
		//}
	
}

function waitCheck(){
		fieldlength= $("#TextBox").val().length;
		$('#length').text('Characters entered:'+fieldlength);
		inputText=$("#TextBox").val();
		$('#InputString').text("text: "+inputText);
}