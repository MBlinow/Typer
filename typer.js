
$(document).ready(function(){
	//Main function.  Starts on page load.
	timeLimit=5;
	$('#TopPane').text("The quick brown fox jumps over the lazy dog.");
	$("#Timer").text('Time: ' +timeLimit);
	waitToStart();
	matchCharLengths();
	
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
		if (fieldlength>0){
			clearInterval(WaitInterval);
			startTest();
		}
}

function matchCharLengths(){
	//Sets the input text field to a max length equivalent to the length of the target text.
	targetLength= $("#TopPane").text().length;
	$("#TextBox").attr("maxlength", targetLength);
}

function startTest(){
	//currently just starts the countdown clock.  Can  be used for any other actions to be taken at start of test.
	startCountDown();
}

function startCountDown(){
	initialTime=timeLimit;
	countdownInterval= setInterval(clockTimeDown, 1000);
}
function clockTimeDown(){
	//Decrements the countdown clock and check for conditions to end the test
	//test is ended if the max character length has been met or if the clock has reached 0
	timeLimit--;
	$("#Timer").text('Time: ' +timeLimit);
	if ($("#TextBox").val().length==targetLength){
		stopTest();
	}
	if (timeLimit==0){
		stopTest();
	}
}

function stopTest(){
	//Called when one of the conditions for the end of the test has been met.
	//clears countdown for clock and sets the text input field to readonly so no more changes can be made
	//
	clearInterval(countdownInterval);
	$("#TextBox").attr("readonly", "True");
	gradeTest();
}

function gradeTest(){
	input=$("#TextBox").val();
	expectedInput=$("#TopPane").text();
	inputWords=input.split(" ");
	expectedInputWords=expectedInput.split(" ");
	totalWordsTyped=inputWords.length;
	calcWordsPerMinute(initialTime-timeLimit, totalWordsTyped)
}
function calcWordsPerMinute(elapsedTime, words){
	var minutes=elapsedTime/60;
	alert(words/minutes);
}