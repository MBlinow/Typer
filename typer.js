function TestController(Timer){

};
//The TestController is responsible for most of the logic for updating
//the statistics pane and handling grading at the end of the test
//
//
TestController.prototype = {

	
	matchCharLengths: function(){
		//Sets the TextBox to have a max character length equal
		//to the length of TopPane
		var targetLength= $("#TopPane").text().length;
		$("#TextBox").attr("maxlength", targetLength);
	},
	
	gradeTest: function(){
		//Text is split into an array of substrings representing words
		//When the input word is equal to the expected word, that word is correct
		//Spaces are ignored here, but are counted towards the total character count 
		//so extra spaces will limit final scores
		
		var input=$("#TextBox").val();
		var expectedInput=$("#TopPane").text();
		
		$('#TextBox').remove(); //removes the input textbox so that later the formatted text can be placed on the element beneath it.
		
		var inputWords=input.trim(' ').split(/[ ]+/);//Here the strings are split into arrays of words for comparison
		var expectedInputWords=expectedInput.trim(' ').split(/[ ]+/);
		
		var correctWords=0;
		for (i=0; i<inputWords.length; i++){
			if (expectedInputWords.length<i){
				//code for labelling words incorrect for highlighting can go here
				this.outputGradedText(inputWords[i], false);
			}
			else if (expectedInputWords[i]==inputWords[i]){
				correctWords++
				this.outputGradedText(inputWords[i], true);
			}
			else{
				//code for labelling words incorrect for highlighting can go here
				this.outputGradedText(inputWords[i], false);
			}
		}
		this.calcWordsPerMinute(this.Timer.initialTime-this.Timer.currentTime, correctWords)
		this.displayAccuracy(inputWords.length, correctWords)
	},
	
	calcWordsPerMinute: function(elapsedTime, words){
		//Accepts arguments for time elapsed and amount of words correctly spelled
		//outputs a string indicating words per minute
		var minutes=elapsedTime/60;
		$("#results").text("WPM: "+ Math.round(words/minutes))
		},
		
		displayAccuracy: function(typed, correct){
		//calculates the accuracy then sends to to the #accuracy html element
		
		var accuracy=Math.round((correct/typed)*100);
		$("#accuracy").text("Accuracy: "+accuracy+"%");
		},
		
	outputGradedText: function(word, isCorrect){
		//Formats graded text into BottomPane html object.  
		//Words that were typed incorrectly are colored red.
		if (isCorrect){
			$('#BottomPane').append(word.fontcolor('Black')+' ');
		}
		else {
			$('#BottomPane').append(word.fontcolor('Red')+' ');

		}
		
	},
	
	updateWordsCount: function(){
		//Indicates total words typed during the test.
		//Currently called from the 1000ms loop that also updates the timer
		//This could be given its own loop with higher refresh rate for a more responsive display.
		$("#WordsTyped").text("Words Typed: "+$("#TextBox").val().trim(' ').split(/[ ]+/).length);
		},
		
		stopTest: function(){
		clearInterval(countdownInterval);
		$("#TextBox").attr("readonly", "True");
		this.gradeTest();
	},
}

//The Timer object keeps track of the time related variables and 
//keeps the Time html object up-to-date
//
//
function Timer(initialTime) {
	this.initialTime=initialTime;
	this.currentTime=initialTime;
};
Timer.prototype = {	
	
	
	clockTimeDown: function(){
		//decrements currentTime
		this.currentTime--;
	},
	
	updateClockDisplay: function(){
		//sends current time to clock html element
		$("#Timer").text(this.formatSecondstoMinutes(this.currentTime));
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
	
	

}


$(document).ready(function(){
	//Main function.  Starts on page load.
	
	//StartTime= Initial Timer for Test
	var startTime=90;
	//This is the text that will be used in the typing test.
	$('#TopPane').text("They say that to do injustice is, by nature, good; to suffer injustice, evil; but that the evil is greater than the good. And so when men have both done and suffered injustice and have had experience of both, not being able to avoid the one and obtain the other, they think that they had better agree among themselves to have neither; hence there arise laws and mutual covenants; and that which is ordained by law is termed by them lawful and just. This they affirm to be the origin and nature of justice; --it is a mean or compromise, between the best of all, which is to do injustice and not be punished, and the worst of all, which is to suffer injustice without the power of retaliation; and justice, being at a middle point between the two, is tolerated not as a good, but as the lesser evil, and honoured by reason of the inability of men to do injustice. For no man who is worthy to be called a man would ever submit to such an agreement if he were able to resist; he would be mad if he did. Such is the received account, Socrates, of the nature and origin of justice.");
	////////////////////////////////////////
	Tester= new TestController();
	Tester.Timer= new Timer(startTime);
	
	waitToStart();
});

function waitToStart(){
	//creates an interval timer to call waitCheck()
	//sets initial value for TopPane display


	
	
	$("#Timer").text(Tester.Timer.formatSecondstoMinutes(Tester.Timer.currentTime));
	Tester.matchCharLengths();
	
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


function startTest(){
	//Starts the countdown clock.  Can  be used for any other actions to be taken at start of test.
	countdownInterval= setInterval(function(){
	var targetLength=$("#TopPane").text().length;
		Tester.Timer.clockTimeDown();
		Tester.Timer.updateClockDisplay();
		Tester.updateWordsCount();
			if ($("#TextBox").val().length==targetLength){
				Tester.stopTest();
			}
			if (Tester.Timer.currentTime==0){
				Tester.stopTest();
			}
		}, 1000);

	
}