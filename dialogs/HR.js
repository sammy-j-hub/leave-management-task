const {AttachmentLayoutTypes, CardFactory, MessageFactory } = require('botbuilder');
const {ChoiceFactory, ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const applicationLeave = require('./navigationCards/HRoptionsList/applicationLeave.json');
const leaveBalance = require('./navigationCards/HRoptionsList/leaveBalance.json');
const HRMainWaterfall = 'HR_MainWaterfall'


class HRDialog extends ComponentDialog {
    constructor(userData) {
        super('HRDialog');

        this.userData = userData
        // Define the main dialog and its related components.

        this.addDialog(new ChoicePrompt('CHOICE_PROMPT'));
        this.addDialog(new WaterfallDialog('HR_MainWaterfall', [
            this.HrWaterfallStep1.bind(this),
            this.HrWaterfallStep2.bind(this)
        ]));

        // The initial child Dialog to run.
        this.initialDialogId = HRMainWaterfall;
    }

    async HrWaterfallStep1(step) {
        // show list of options for "other" -including Request for Leave, Apply for Leave,Leave Balance, Request Status 
        return await step.prompt('CHOICE_PROMPT', {
            prompt: 'Please select an option.',
            choices: ChoiceFactory.toChoices(['Request for Leave', 'Leave Balance', 'Request Status'])
        });
    }
    //this is to show adaptive card application if "request for leave" is clicked"
    async HrWaterfallStep2(step) {
        step.values.HrWaterfallStep1 = step.result.value;

        switch (step.result.value) {
            case 'Request for Leave':
                await step.context.sendActivity({ attachments: [this.leaveApplicationCard()] }); 
                break;
            case 'Leave Balance':
                await step.context.sendActivity({ attachments: [this.leaveBalanceCard()] });
                break;
            case 'Request Status':
                const message = MessageFactory.text('Status is pending...')
                await step.context.sendActivity(message);
                break;
            default:
                await step.context.sendActivity({
                attachments: [
                    this.leaveApplicationCard(),
                    this.leaveBalanceCard()
                    ],
                    attachmentLayout: AttachmentLayoutTypes.Carousel
                });
                    break;
            }
        // Give the user instructions about what to do next
         await step.context.sendActivity('Thank you!');
         return await step.endDialog();
    }

    //Apadtive card showing Input Form
    leaveApplicationCard() {
        return CardFactory.adaptiveCard(applicationLeave);
    }
    //Adaptive card showing Leave Balance Card
    leaveBalanceCard() {
        return CardFactory.adaptiveCard(leaveBalance);
    }


}
module.exports.HRDialog = HRDialog;