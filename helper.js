const Database = require('./data');
const _ = require('lodash');

function createSSML(name) {
    let tag = '';

    if (name) {
        tag = "<audio src='https://s3.amazonaws.com/voice-quiz/"+ name +"' />"
    }

    return tag;
}

function createOptions(options) {
    return " And the options are  <break strength='strong'/>  option A. <break strength='medium'/>" + options[0] + " <break strength='strong'/> option B. <break strength='medium'/>" + options[1] + " <break strength='strong'/> option C. <break strength='medium'/>" + options[2] + " <break strength='strong'/> option D. <break strength='medium'/>" + options[3]
}

function generateOptions(answer) {
    var options = [];
    var a = _.random(3);
    options.push(Database[_.random(Database.length-1)].answer);
    options.push(Database[_.random(Database.length-1)].answer);
    options.push(Database[_.random(Database.length-1)].answer);
    options.push(Database[_.random(Database.length-1)].answer);
    options[a] = answer;
    return options
}

const speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
    "Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
    "Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

const speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
    "Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

module.exports = {
    createSSML: createSSML,
    generateOptions: generateOptions,
    speechConsCorrect: speechConsCorrect,
    speechConsWrong: speechConsWrong,
    createOptions: createOptions
};