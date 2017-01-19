// Here we are going to run the bot

'use strict';

var SlackBot = require('slackbots');
require('dotenv').load();

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var bot = new SlackBot({
    token: token,
    dbPath: dbPath,
    name: name
});

bot.on('start', onStart);
bot.on('message', onMessage);

// Start handler
function onStart() {
    console.log("Runnning...");

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    bot.postMessageToChannel('general', 'Start Meow!');
};

// Message Handler
function onMessage(message) {
    if (!isFromBot(message) && isChatMessage(message) && isSayingMeow(message))
        replyWithMeow(message);
};

// isChatMessage
function isChatMessage(message) {
    return message.type === 'message' && Boolean(message.text);
};

// isFromBot
function isFromBot(message) {
    return Boolean(message.bot_id);
};

// isSayingMeow
function isSayingMeow(message) {
    return message.text.toLowerCase().includes('meow');
};

// replyWithMeow
function replyWithMeow(message) {
    bot.postMessage(message.channel, 'Meow!');
};
