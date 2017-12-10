// TODO: maybe they are better to be called drivers in the end? 

const FacebookController =  require('./fb_controller.js');
const DialogFlowController = require('./df_controller.js');

module.exports = {
  Facebook: () => {
    return new FacebookController();
  },
  DialogFlow: () => {
    return new DialogFlowController();
  }
};
