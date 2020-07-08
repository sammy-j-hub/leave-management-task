const ITAdaptiveCard = require('./navigationCards/itHelp.json');
const {CardFactory } = require('botbuilder');

function createITCard(){
    return CardFactory.adaptiveCard(ITAdaptiveCard);
}
module.export = createITCard;