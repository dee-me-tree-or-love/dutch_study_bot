// IDEA: consider adding middleware to the system here, so that actions like 
// these also can do something: '<domain>.*'
module.exports = class Dispatcher {

  constructor(defaultHandler){
    if(!defaultHandler){
      throw new Error("No default handler specified!");
    }
    this.handlers = {default: defaultHandler};
  }

  /**
   * Receive a new intent and match the registered handler
   * @param {*} intent 
   */
  receiveIntent(intent, pageId){
    const action = intent.action; 
    if(intent.actionIncomplete){
      this.trigger('default', intent, pageId);
    }
    // maybe do some extra processing? 
    return this.trigger(action, intent, pageId);
  }

  /**
   * Register a handler instance on the action 
   * @param {*} action 
   * @param {*} handler 
   */
  registerHandler(action, handler){
    const exists = this.handlers[action];
    if(!exists){
      this.handlers[action] = handler;
    }else{
      // TODO: maybe try instead to allow multiple handler match same action 
      // sort of like the router in express behaves
      throw new Error('There already exists a handler with this action key')
    }
  }

  /**
   * Alias for Dispatcher.registerHandler
   * @param {*} action 
   * @param {*} handler 
   */
  reg(action, handler) {
    this.registerHandler(action, handler);
  }


  /**
   * Call the handler of certain action to do something with it
   * @param {*} action 
   * @param {*} intent 
   */
  trigger(action, intent, pageId){
    const handler =  this.handlers[action];
    if(handler){
      return this.handlers[action].handle(intent, pageId);
    }
    // if a handler was not found: 
    throw new Error(`Could not trigger a handler with action key @${action}`);
  }

}