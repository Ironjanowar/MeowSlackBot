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
    // Display messages
    listener(message);

    // Meow handler
    if (!isFromBot(message) && isChatMessage(message) && isSayingMeow(message))
        replyWithMeow(message);
};

// listener
function listener(message) {
    // If there is no message to display return
    if (!message.text || !message.user) return;
    
    var sneak = "";
    
    // If it's a user who's talking
    if (isDirectMessage(message)) {
        sneak = getUserNameById(message.user);
        // User ID
        sneak += " [" + message.user + "] -> ";
    }

    if (isChannelMessage(message)) {
        sneak = getChannelNameById(message.channel);
        // User name
        sneak += " [" + getUserNameById(message.user) + "] -> ";
    }

    if (isGroupMessage(message)) {
        sneak = getGroupNameById(message.channel);
        // User name
        sneak += " [" + getUserNameById(message.user) + "] -> ";
    }

    // Message text
    sneak += message.text;

    console.log(sneak);
};

// getChannelNameById
function getChannelNameById(channelId) {
    var channels = bot.getChannels()._value.channels;
    var searchedChannel = channels.find( channel => channel.id === channelId );
    return searchedChannel.name;
};

// getGroupNameById
function getGroupNameById(groupId) {
    var groups = bot.getGroups()._value.groups;
    var searchedGroup = groups.find( group => group.id === groupId );
    return searchedGroup.name;
};

// Gets user's name by ID
function getUserNameById(userId) {
    var users = bot.getUsers()._value.members;
    var searchedUser = users.find( user => user.id === userId );
    return searchedUser.name;
};

// C isChannelMessage
function isChannelMessage(message) {
    return message.channel.startsWith('C');
};

// D isDirectMessage
function isDirectMessage(message) {
    return message.channel.startsWith('D');
};

// G isGroupMessage
function isGroupMessage(message) {
    return message.channel.startsWith('G');
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
