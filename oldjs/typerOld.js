function Timer(initialTime) {
	this.initialTime=initialTime;
	this.currentTime=initialTime;
};
Timer.prototype = {	
	

	
	clockTimeDown: function(){
		console.log(this.currentTime);
		this.currentTime--;
		this.updateClockDisplay();
		console.log(this.currentTime);
	},
	
	updateClockDisplay: function(){
		$("#Timer").text(this.formatSecondstoMinutes(this.currentTime));
		console.log(this.currentTime);
	},
	
	formatSecondstoMinutes: function(seconds){
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
	},
	
	startCountDown: function(){
		this.countdownInterval= setInterval(this.clockTimeDown(), 1000);
	}
	//this.startCountDown=function(){
		//this.countdownInterval=setInterval(this.clockTimeDown, 1000);
	//}
	

}


$(document).ready(function(){
	//Main function.  Starts on page load.
	
	waitToStart();
	TestTimer= new Timer(90);
});

function waitToStart(){
	//creates an interval timer to call waitCheck()
	//sets initial value for timer and 
	//initial values for the clock and TopPane displays

	
	//This is the text that will be used in the typing test.
	$('#TopPane').text("They say that to do injustice is, by nature, good; to suffer injustice, evil; but that the evil is greater than the good. And so when men have both done and suffered injustice and have had experience of both, not being able to avoid the one and obtain the other, they think that they had better agree among themselves to have neither; hence there arise laws and mutual covenants; and that which is ordained by law is termed by them lawful and just. This they affirm to be the origin and nature of justice; --it is a mean or compromise, between the best of all, which is to do injustice and not be punished, and the worst of all, which is to suffer injustice without the power of retaliation; and justice, being at a middle point between the two, is tolerated not as a good, but as the lesser evil, and honoured by reason of the inability of men to do injustice. For no man who is worthy to be called a man would ever submit to such an agreement if he were able to resist; he would be mad if he did. Such is the received account, Socrates, of the nature and origin of justice.");
	
	//This is the time limit in seconds
	//var startTime=90;
	//TestTimer= new Timer(90);
	
	timeLimit=90;
	
	$("#Timer").text(formatSecondstoMinutes(timeLimit));
	matchCharLengths();
	
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
	TestTimer.startCountDown();
	//TestTimer.startCountDown();
	
}

function startCountDown(){
	//creates an interval timer to start the clock counting down
	//initialTime=timeLimit;
	//countdownInterval= setInterval(clockTimeDown, 1000);
	countdownInterval= setInterval(TestTimer.clockTimeDown(), 1000);
}
function clockTimeDown(){
	//Decrements the countdown clock and check for conditions to end the test
	//test is ended if the max character length has been met or if the clock has reached 0
	timeLimit--;
	updateClockDisplay();
	updateWordsCount();
	//if ($("#TextBox").val().length==targetLength){
	//	stopTest();
	//}
	//if (timeLimit==0){
	//	stopTest();
	//}
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
	//clearInterval(countdownInterval);
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
	displayAccuracy(inputWords.length, correctWords)
}

function displayAccuracy(typed, correct){
	var accuracy=Math.round((correct/typed)*100);
	$("#accuracy").text("Accuracy: "+accuracy+"%");
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