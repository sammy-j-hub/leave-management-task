const { LuisRecognizer } = require('botbuilder-ai');

class leaveManagementRecognizer {
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            // Set the recognizer options depending on which endpoint version you want to use e.g v2 or v3.
            // More details can be found in https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/luis-migration-api-v3
            const recognizerOptions = {
                apiVersion: 'v3'
            };

            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeLuisQuery(context) {
        return await this.recognizer.recognize(context);
    }

    getFromEntities(result) {
        let vacationFrom;
        if (result.entities.$instance.vacationRequest) {
            vacationFrom = result.entities.$instance.vacationRequest[0].text;
        }
        return { vacationFrom: vacationFrom };
    }

    getToEntities(result) {
        let numberDays
        if (result.entities.$instance.numberOfdays) {
            numberDays = result.entities.$instance.numberOfdays[0].text;
        }

        return { numberOfdays: numberDays};
    }

}

module.exports.leaveManagementRecognizer = leaveManagementRecognizer;
