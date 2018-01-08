'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var router = express.Router();
var http = require('http').Server(app);


require('dotenv').config()

// You need it to get the body attribute in the request object.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))


var botkit = require('botkit');

var slackController = botkit.slackbot({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  scopes: ['bot'],
  redirectUri: process.env.URL + '/oauth',
  json_file_store: __dirname + '/.data/db/',
  disable_startup_messages: true,
  hostname: 'localhost',
  port: '8080'
});

slackController.startTicking();
slackController.createOauthEndpoints(app);
slackController.createWebhookEndpoints(app);



slackController.hears(['.*'], 'direct_message,direct_mention,mention', function(bot, message) {
  console.log("Slackbot received a message with text -  "+message.text);
  bot.reply(message, "User Typed In - "+message.text);
});

app.listen(8080);
console.log('Listening on port 8080...');
