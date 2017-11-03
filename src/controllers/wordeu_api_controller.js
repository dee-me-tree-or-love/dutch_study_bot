// TODO: maybe should be moved to the different source root?
  // It is a special case of a controler, so...
// TODO: maybe make it an sdk for the wordeu-api for JS, so then, 
  // only one implementation would be enouh, and all the extra stuff can
  // either be an extension of the class or added with an open issue in GH
const request = require('request');
// in order to return the request promises, this library is used
  // to avoid extra dependencies and keep it to the native promises, this one is 
  // used instead of 'request-promise', which uses BlueBird promises
  // for usage api refer to: https://www.npmjs.com/package/request-promise
const requestPromise = require('request-promise-native');

module.exports = class WordeuApiController {
  constructor() {
    this.HOST = process.env.WORDEU_API_HOST || 'http://localhost:8008/'
  }

  /**
   * Call the ensure user endpoint of the wordeu-api
   * @param {*} page_id 
   * @param {*} name 
   * @returns {Promise} with the ensure request
   */
  ensureUser(pageId, name) {
    // TODO: add some fault correction for the page id
    const options = {
      uri: `${this.HOST}users/pid/ensure/${pageId}`,
      headers: {
        'User-Agent': 'WordeuApiController'
      },
      body: {
        name: name,
        pageId: pageId
      },
      json: true // Automatically parses the JSON string in the response
    }
    // could also go with just making a new Promise object 
    // and inside using regular request library, but huh, this is neat
    return requestPromise(options);
  }
}