const { AttachmentLayoutTypes, ActivityTypes, CardFactory } = require('botbuilder');
const { ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { LuisRecognizer } = require('botbuilder-ai');
const { HRDialog, HRMainWaterfall } = require('./HR');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

//Importing all the required files for the working
const ITAdaptiveCard = require('./navigationCards/itHelp.json');
const HRAdaptiveCard = require('./navigationCards/hrHelp.json');

class MainDialog extends ComponentDialog {
    constructor(conversationState, luisRecognizer) {
        super('MainDialog');
        this.userData = conversationState.createProperty('MainDialog'); 

        // configuring luis
        this.recognizer = luisRecognizer
        this.topIntent = 'test'

        // Define the main dialog and its related components.
        this.addDialog(new ChoicePrompt('cardPrompt'));
        this.addDialog(new HRDialog(this.userData));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            // this.mainDialogStep1.bind(this),
            this.choiceCardStep.bind(this),
            this.showCardStep.bind(this)
        ]));

        // The initial child Dialog to run.
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
    // async mainDialogStep1(stepContext) {
    //     console.log(' Is this running?');
    //     try {
    //         if (stepContext.context.activity.text) {
    //             console.log(' Is this running?');
    //             var luisResult = await this.recognizer.recognize(stepContext.context) // recognizing luis results
    //             this.topIntent = await LuisRecognizer.topIntent(luisResult); //extracting intent from it
                
    //             // checking intent or action to move to next flow
    //             if (this.topIntent) {
    //                 stepContext.context.activity.value.action = this.topIntent.replace(/_/g, " ") // assigning intent value to action to ease flow
    //                 await stepContext.next();
    //         }
    //     }
    //         else {// if nothing matches move ahead
            
    //             await stepContext.next();
    //             }
    //         }
    //     catch (error) {
    //         console.error("---", error);
    //         await stepContext.context.sendActivity("Could not understand this. Here are few options you can try!");
    //         return await this.beginDialog('mainWaterfallDialog');
    //     }
    //     return await stepContext.endDialog();

    // }

    async choiceCardStep(stepContext) {
        console.log('MainDialog.choiceCardStep');

        // Create the PromptOptions which contain the prompt and re-prompt messages.
        // PromptOptions also contains the list of choices available to the user.
        const options = {
            prompt: 'Welcome "Employee ID - xxxxx".'+ 'Please select an option for HR or IT or type in your question. ',
            retryPrompt: 'That was not a valid choice, please select a card or number from 1 to 3.',
            choices: this.getChoices()
        };

        // Prompt the user with the configured PromptOptions.
        return await stepContext.prompt('cardPrompt', options);
    }

    async showCardStep(stepContext) {
        console.log('MainDialog.showCardStep');
        console.log(stepContext.result.value);

        switch (stepContext.result.value) {
        case 'HR':
            await stepContext.context.sendActivity({ attachments: [this.createHRCard()] });
            return await stepContext.beginDialog('HRDialog'); //check
            break;
        case 'IT':
            await stepContext.context.sendActivity({ attachments: [this.createITCard()] });
            break;
        default:
            await stepContext.context.sendActivity({
                attachments: [
                    this.createHRCard(),
                    this.createITCard()
                ],
                attachmentLayout: AttachmentLayoutTypes.Carousel
            });
            break;
        }
         // Give the user instructions about what to do next
         await stepContext.context.sendActivity('Type anything to see another card.');

         return await stepContext.endDialog();
    }

    getChoices() {
        const cardOptions = [
            {
                value: 'HR',
                synonyms: ['adaptive']
            },
            {
                value: 'IT',
                synonyms: ['adaptive']
            },
            {
                value: 'All Cards',
                synonyms: ['all']
            }
        ];

        return cardOptions;
    }
    createHRCard() {
        return CardFactory.adaptiveCard(HRAdaptiveCard);
    }

    createITCard() {
            return CardFactory.adaptiveCard(ITAdaptiveCard);
        }

}
module.exports.MainDialog = MainDialog;