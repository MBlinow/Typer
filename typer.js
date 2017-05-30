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
		//One downside to this solution is that adding an extra word or accidentally placing a space inside
		//of a word will cause all later words to show as incorrect.
		//
		
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
		$("#Results").text("WPM: "+ Math.round(words/minutes))
		},
		
	displayAccuracy: function(typed, correct){
		//calculates the accuracy then sends to to the #accuracy html element
		var accuracy=Math.round((correct/typed)*100);
		$("#Accuracy").text("Accuracy: "+accuracy+"%");
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
		//stops the interval timer running the clock
		//and sets the TextBox to readonly
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
	//To Build A Fire by Jack London
	$('#TopPane').text("Day had broken cold and grey, exceedingly cold and grey, when the man turned aside from the main Yukon trail and climbed the high earth- bank, where a dim and little-travelled trail led eastward through the fat spruce timberland. It was a steep bank, and he paused for breath at the top, excusing the act to himself by looking at his watch. It was nine o'clock. There was no sun nor hint of sun, though there was not a cloud in the sky. It was a clear day, and yet there seemed an intangible pall over the face of things, a subtle gloom that made the day dark, and that was due to the absence of sun. This fact did not worry the man. He was used to the lack of sun. It had been days since he had seen the sun, and he knew that a few more days must pass before that cheerful orb, due south, would just peep above the sky- line and dip immediately from view. The man flung a look back along the way he had come. The Yukon lay a mile wide and hidden under three feet of ice. On top of this ice were as many feet of snow. It was all pure white, rolling in gentle undulations where the ice-jams of the freeze-up had formed. North and south, as far as his eye could see, it was unbroken white, save for a dark hair-line that curved and twisted from around the spruce- covered island to the south, and that curved and twisted away into the north, where it disappeared behind another spruce-covered island. This dark hair-line was the trail--the main trail--that led south five hundred miles to the Chilcoot Pass, Dyea, and salt water; and that led north seventy miles to Dawson, and still on to the north a thousand miles to Nulato, and finally to St. Michael on Bering Sea, a thousand miles and half a thousand more.");
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

//Additional feature ideas:
//Buttons to input new values for starting text and time
//Reset button to start test over without refreshing page
//Variety of different text samples and a way to choose between them or pick one at random
//