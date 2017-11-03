// should be initialized! brackets around require make the class usable
const WordeuAPIController = new (require('./wordeu_api_controller'))();
const FacebookController =  require('./fb_controller.js');
const DialogFlowController = require('./df_controller.js');

module.exports = {
  Facebook: () => {
    return new FacebookController(WordeuAPIController);
  },
  DialogFlow: () => {
    return new DialogFlowController(WordeuAPIController);
  }
};
