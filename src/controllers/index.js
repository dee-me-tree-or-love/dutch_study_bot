// TODO: maybe they are better to be called drivers in the end? 

// should be initialized! brackets around require make the class usable
const WordeuAPIController = new (require('./wa_controller'))();
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
