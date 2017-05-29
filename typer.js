
$(document).ready(function(){
	//Main function.  Starts on page load.
	timeLimit=3;
	$('#TopPane').text("The quick brown fox jumps over the lazy dog.");
	$("#Timer").text(formatSecondstoMinutes(timeLimit));
	waitToStart();
	matchCharLengths();
	// The quock brown fox jupps over the lazy dog.


	
});

function waitToStart(){
	WaitInterval= setInterval(waitCheck, 50);
	
}

function waitCheck(){
		fieldlength= $("#TextBox").val().length;
		$('#length').text('Characters entered:'+fieldlength);
		inputText=$("#TextBox").val();
		//$('#InputString').text("text: "+inputText);
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
	$("#Timer").text(formatSecondstoMinutes(timeLimit));
	if ($("#TextBox").val().length==targetLength){
		stopTest();
	}
	if (timeLimit==0){
		stopTest();
	}
}
function formatSecondstoMinutes(seconds){
	var minutes=0;
	
	if (seconds>60){
		minutes=seconds/60;
		minutes=Math.floor(minutes);
		seconds-=minutes*60;
	}
	if (minutes<10){
		minutes="0"+minutes;
	}
	if (seconds<10){
		seconds="0"+seconds;
	}
	var formattedTime="Time "+minutes+":"+seconds;

	return formattedTime;
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
	var input=$("#TextBox").val();
	var expectedInput=$("#TopPane").text();
	$('#TextBox').remove();
	var inputWords=input.split(" ");
	var expectedInputWords=expectedInput.split(" ");
	var correctWords=0;
	for (i=0; i<inputWords.length; i++){
		if (expectedInputWords.length<i){
			//code for labelling words incorrect for highlighting can go here
			outputGradedText(inputWords[i], false);
		}
		else if (expectedInputWords[i]==inputWords[i]){
			correctWords++
			outputGradedText(inputWords[i], true);
		}
		else{
			//code for labelling words incorrect for highlighting can go here
			outputGradedText(inputWords[i], false);
		}
	}
	calcWordsPerMinute(initialTime-timeLimit, correctWords)
}

function outputGradedText(word, isCorrect){
	//var destination=$("#InputString").text();
	if (isCorrect){
		$('#BottomPane').append(word.fontcolor('Black')+' ');
	}
	else {
		$('#BottomPane').append(word.fontcolor('Red')+' ');

	}
	
}
function compareWords(input, expected){
	
}
function calcWordsPerMinute(elapsedTime, words){
	var minutes=elapsedTime/60;
	//console.log(Math.round(words/minutes)+"Words="+words);
	$("#results").text("WPM: "+ Math.round(words/minutes))
}