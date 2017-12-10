// IDEA: maybe make it an sdk for the wordeu-api for JS, so then, 
// in order to return the request promises, this library is used
// to avoid extra dependencies and keep it to the native promises, this one is 
// used instead of 'request-promise', which uses BlueBird promises
// for usage api refer to: https://www.npmjs.com/package/request-promise
const requestPromise = require('request-promise-native');

module.exports = class WordeuApiDriver {
  constructor(host) {
    this.HOST = host || process.env.WORDEU_API_HOST || 'http://localhost:8008/'
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
      method: 'PUT',
      uri: `${this.HOST}users/pid/ensure/${pageId}`,
      headers: {
        'User-Agent': 'WordeuApiDriver'
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

  /**
   * Creates a new word entry in the wordeu database and connects it to the user
   * @param {*} term 
   * @param {*} pageId 
   * @returns {Promise} a promise chain as explained in definition 
   */
  addLearningWord(term, pageId) {
    const create = {
      method: 'POST',
      uri: `${this.HOST}words/new`,
      headers: {
        'User-Agent': 'WordeuApiDriver'
      },
      body: {
        title: term,
        page_id: pageId
      },
      json: true
    }

    // localhost:8008/users/pid/121/add/word

    const p = requestPromise(create)
      .then((res) => {
        // FIXME: this is rather insecure
        const link = {
          method: 'POST',
          uri: `${this.HOST}users/pid/${pageId}/add/word`,
          headers: {
            'User-Agent': 'WordeuApiDriver'
          },
          body: {
            targetTitle: res.title,
            relationType: 'learns'
          },
          json: true
        }
        return requestPromise(link);
      })
    return p;
  }

  /**
   * Creates a new word entry in the wordeu database and connects it to the user
   * @param {*} term 
   * @param {*} pageId 
   * @returns {Promise} a promise chain as explained in definition 
   */
  addWordTranslation(translation, term, pageId) {
    const create = {
      method: 'POST',
      uri: `${this.HOST}words/new`,
      headers: {
        'User-Agent': 'WordeuApiDriver'
      },
      body: {
        title: translation,
        page_id: pageId
      },
      json: true
    }

    // localhost:8008/users/pid/121/add/word

    const p = requestPromise(create)
      .then((res) => {
        // FIXME: this is rather insecure
        const link = {
          method: 'POST',
          uri: `${this.HOST}words/relation/create`,
          headers: {
            'User-Agent': 'WordeuApiDriver'
          },
          body: {
            rootTitle: res.title,
            targetTitle: term,
            relationType: 'translates'
          },
          json: true
        }
        return requestPromise(link);
      })
    return p;
  }

  getQuizWord(pageId){
    const get = {
      method: 'GET',
      uri: `${this.HOST}quiz/quiz-word/`,
      headers: {
        'User-Agent': 'WordeuApiDriver'
      },
      body: {
        page_id: pageId
      },
      json: true
    }
    return requestPromise(get);
  }

  submitQuizAnswer(quizWord, answer, pageId){
    const put = {
      method: 'PUT',
      uri: `${this.HOST}quiz/quiz-word/answer/`,
      headers: {
        'User-Agent': 'WordeuApiDriver'
      },
      body: {
        quiz_word: quizWord,
        answer: answer,
        page_id: pageId
      },
      json: true
    }
    return requestPromise(put);
  }
}