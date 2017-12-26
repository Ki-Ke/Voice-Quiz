/**
 Copyright 2017 KiKe. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 **/
'use strict';
const Alexa = require('alexa-sdk');
const _ = require('lodash');

const Database = require('./data');
const { createSSML } = require('./helper');
const { generateOptions } = require('./helper');
const { speechConsCorrect } = require('./helper');
const { speechConsWrong } = require('./helper');
const { createOptions } = require('./helper');
const APP_NAME = 'Voice Quiz';

const APP_ID = undefined;
const VOICE_QUIZ_STATE = {
    START: "START_MODE",
    QUESTION: "QUESTION_MODE",
    ANSWER: "ANSWER_MODE"
};

// Global vars
var speechOutput = '';
var reprompt = '';

const languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}!. Say start quiz to start playing the game. Or say help to learn how to play the game`
        }
    },
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}! Say start quiz to start playing the game. Or say help to learn how to play the game`
        }
    },
    "en-GB": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}! Say start quiz to start playing the game. Or say help to learn how to play the game`
        }
    },
    "de-DE": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}! Say start quiz to start playing the game. Or say help to learn how to play the game`
        }
    }
};

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageString;
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers, startVoiceQuiz, answer);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(":ask", this.t("WELCOME_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'StartVoiceQuizIntent': function () {
        this.handler.state = VOICE_QUIZ_STATE.START;
        this.emitWithState("StartVoiceQuiz");
    },
    'AnswerIntent': function () {
        this.handler.state = VOICE_QUIZ_STATE.ANSWER;
        this.emitWithState("Answer", this.event.request.intent.slots);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = '';
        reprompt = '';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    "AMAZON.PauseIntent": function () {
        speechOutput = "This is a place holder response for the intent named AMAZON.PauseIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.ResumeIntent": function () {
        speechOutput = "This is a place holder response for the intent named AMAZON.ResumeIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted. Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

const startVoiceQuiz = Alexa.CreateStateHandler(VOICE_QUIZ_STATE.START, {
    "StartVoiceQuiz": function () {
        this.attributes['count'] = _.random(Database.length-1);
        this.attributes['answer'] = Database[this.attributes['count']].answer;
        var options = generateOptions(Database[this.attributes['count']].answer);
        speechOutput = "OK let Start. Playing audio " + createSSML(Database[this.attributes['count']].audio) + createOptions(options);
        this.emit(':ask', speechOutput);
    },
    'AnswerIntent': function () {
        this.handler.state = VOICE_QUIZ_STATE.ANSWER;
        this.emitWithState("Answer", this.event.request.intent.slots);
    },


    'AMAZON.HelpIntent': function () {
        speechOutput = '';
        reprompt = '';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    "AMAZON.PauseIntent": function () {
        speechOutput = "This is a place holder response for the intent named AMAZON.PauseIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.ResumeIntent": function () {
        speechOutput = "This is a place holder response for the intent named AMAZON.ResumeIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted. Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
});

const answer = Alexa.CreateStateHandler(VOICE_QUIZ_STATE.ANSWER, {
    "Answer": function (slots) {
        let userAnswer = slots.Answer.value;
        console.log(this.attributes['answer']);
        console.log(userAnswer);
        if (userAnswer === this.attributes['answer']) {
            speechOutput = "<say-as interpret-as='interjection'>" + speechConsCorrect[_.random(speechConsCorrect.length-1)] + "that's correct! </say-as><break strength='strong'/>";
        } else {
            speechOutput = "<say-as interpret-as='interjection'>" + speechConsWrong[_.random(speechConsWrong.length-1)] + " that's wrong! </say-as><break strength='strong'/> ";
        }
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = '';
        reprompt = '';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    "AMAZON.PauseIntent": function () {
        speechOutput = "This is a place holder response for the intent named AMAZON.PauseIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.ResumeIntent": function () {
        speechOutput = "This is a place holder response for the intent named AMAZON.ResumeIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted. Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
});