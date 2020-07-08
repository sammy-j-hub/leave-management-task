const path = require('path');
const restify = require('restify');

const dbconnection = require('./database/dbConnection');
const { BotFrameworkAdapter , MemoryStorage, ConversationState, UserState} = require('botbuilder');


const { RichCardsBot } = require('./bots/welcomeMessageBot');
const { MainDialog } = require('./dialogs/mainDialog');
const { LuisRecognizer } = require('botbuilder-ai');
const {requestRecognizer} = require('./dialogs/predictionLuis');

// Read botFilePath and botFileSecret from .env file.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create adapter. See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    await conversationState.delete(context);
};

// For local development, in-memory storage is used.
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: `https://${ LuisAPIHostName }` };

const luisRecognizer = new requestRecognizer(luisConfig);

// Create the main dialog.
const dialog = new MainDialog(conversationState, luisRecognizer);
const bot = new RichCardsBot(conversationState, userState, dialog);



// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (context) => {
        // route to bot activity handler.
        await bot.run(context);
    });
});


