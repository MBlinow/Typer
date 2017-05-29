
$(document).ready(function(){
	//Main function.  Starts on page load.

	
	//This is the text that will be used in the typing test.
	$('#TopPane').text("The quick brown fox jumps over the lazy dog.");
	//
	//This is the time limit in seconds
	timeLimit=90;
	$("#Timer").text(formatSecondstoMinutes(timeLimit));
	
	waitToStart();
	matchCharLengths();


	
});

function waitToStart(){
	//creates an interval timer to call waitCheck()
	//this timer will be cleared once the test is started
	
	WaitInterval= setInterval(waitCheck, 50);
	
}

function waitCheck(){
	//A loop that is started when the page is opened
	//once any characters are entered in the text field it will start the test
	//and delete the interval that was calling it
		fieldlength= $("#TextBox").val().length;
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
	//creates an interval timer to start the clock counting down
	initialTime=timeLimit;
	countdownInterval= setInterval(clockTimeDown, 1000);
}
function clockTimeDown(){
	//Decrements the countdown clock and check for conditions to end the test
	//test is ended if the max character length has been met or if the clock has reached 0
	timeLimit--;
	updateClockDisplay();
	updateWordsCount();
	if ($("#TextBox").val().length==targetLength){
		stopTest();
	}
	if (timeLimit==0){
		stopTest();
	}
}
function updateClockDisplay(){
	$("#Timer").text(formatSecondstoMinutes(timeLimit));
}
function updateWordsCount(){
	$("#WordsTyped").text("Words Typed: "+$("#TextBox").val().trim(' ').split(/[ ]+/).length);
}
function formatSecondstoMinutes(seconds){
	//Accepts argument of an integer representing seconds
	//outputs a time in the format of MM:SS.
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
	var inputWords=input.trim(' ').split(/[ ]+/);
	var expectedInputWords=expectedInput.trim(' ').split(/[ ]+/);
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
	//Formates graded text into BottomPane html object.  Words that were spelled wrong
	//are colored red.
	
	if (isCorrect){
		$('#BottomPane').append(word.fontcolor('Black')+' ');
	}
	else {
		$('#BottomPane').append(word.fontcolor('Red')+' ');

	}
	
}

function calcWordsPerMinute(elapsedTime, words){
	//Accepts arguments for time elapsed and amount of words correctly spelled
	//outputs a string indicating words per minute
	var minutes=elapsedTime/60;
	$("#results").text("WPM: "+ Math.round(words/minutes))
}