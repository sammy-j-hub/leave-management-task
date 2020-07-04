const { LuisRecognizer } = require('botbuilder-ai');

class requestRecognizer {
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

    getVacationRequestEntities(result) {
        let fromValue;
        if (result.entities.$instance.vacationRequest) {
            fromValue = result.entities.$instance.vacationRequest[0].text;
        }
        return { from: fromValue };
    }

    getNumberOfDaysEntities(result) {
        let toValue;
        if (result.entities.$instance.numberOfdays) {
            toValue = result.entities.$instance.numberOfdays[0].text;
        }
        return { to: toValue};
    }
}

module.exports.requestRecognizer = requestRecognizer;
