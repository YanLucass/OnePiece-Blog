// FlashMessages.js

class FlashMessages {
    constructor(req) {
      this.req = req;
    }
  
    success(message) {
      this.req.flash('success', message);
    }
  
    error(message) {
      this.req.flash('error', message);
    }
  
    // Você pode adicionar mais métodos para outros tipos de mensagens, se necessário
  }
  
  module.exports = FlashMessages;
  