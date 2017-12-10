const getNotImplemntedException = () => {
  new Error(`${arguments.callee.toString()} is not implemented`)
}

module.exports = class HandlerBase {
  constructor() {
    // TODO: identify if it is even needed
  }

  verifyPayload() {
    throw getNotImplemntedException();
  }

  parsePayload() {
    throw getNotImplemntedException();
  }

  retrieveData() {
    throw getNotImplemntedException();
  }

  prepareResponseMessage() {
    throw getNotImplemntedException();
  }

}