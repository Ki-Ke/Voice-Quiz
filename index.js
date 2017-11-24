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
var Alexa = require('alexa-sdk');

var APP_NAME = 'Voice Quiz';
var APP_ID = undefined;

var VOICE_QUIZ_STATE = {
    START: "START_MODE",
    QUESTION: "QUESTION_MODE"
};

// Global vars
var speechOutput = '';
var reprompt = '';

var languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}`
        }
    },
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}`
        }
    },
    "en-GB": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}`
        }
    },
    "de-DE": {
        "translation": {
            "WELCOME_MESSAGE": `Welcome to ${APP_NAME}`
        }
    }
};


exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageString;
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers, startVoiceQuiz);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.handler.state = VOICE_QUIZ_STATE.START;
        if (this.event.session && !this.event.session.new) {
            this.emit(":ask", this.t("ALREADY_WELCOME_MESSAGE"), this.t("WELCOME_MESSAGE_REPEAT"));
        } else {
            this.emitWithState("StartVoiceQuiz");
        }
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
    "StartVoiceQuizIntent": function () {
        this.handler.state = VOICE_QUIZ_STATE.START;
        this.emitWithState("StartVoiceQuiz");
    },
    'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted.  Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

var startVoiceQuiz = Alexa.CreateStateHandler(VOICE_QUIZ_STATE.START, {
    "StartVoiceQuiz": function () {

        if (this.event.session && !this.event.session.new) {
            this.emit(":ask", this.t("ALREADY_WELCOME_MESSAGE"), this.t("WELCOME_MESSAGE_REPEAT"));
        }

        this.emit(":ask", this.t("WELCOME_MESSAGE"), this.t("HELP_MESSAGE"));
    },
});
