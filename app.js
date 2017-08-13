require('dotenv').config();
var restify = require('restify');
var builder = require('botbuilder');
const Wit = require('node-wit').Wit;

// Setup Wit Client
const client = new Wit({accessToken: process.env.WIT_ACCESS_TOKEN});

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 80, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    console.log("you said: " , session.message.text);
    client.message(session.message.text, {})
        .then((data) => {
            session.send(JSON.stringify(data));
        })
        .catch(console.error);
});
