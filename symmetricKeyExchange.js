var Sender = function(keyLimit){
  keyLimit = keyLimit || 10
  this._privateInteger = Math.floor(Math.random() * keyLimit);
  this.partialKey = null;
  this._secretKey = null;
};

Sender.prototype.generatePartialKey = function(prime, base){
};

Sender.prototype.generateSecretKey = function(prime, partialKey){
};

Sender.prototype.encryptMessage = function(plaintext){
  /* Should, letter by letter, convert the plaintext into ciphertext */
};

Sender.prototype.decryptMessage = function(ciphertext){
};

Sender.prototype.sendMessage = function(plaintext, recipient){
  /* Should generate the cipher text and send it to the recipient */
  /* (Hint:  see receiveMessage) */
};

Sender.prototype.receiveMessage = function(ciphertext){
};

var exchangeKeys = function(alice, bob, prime, base){
  /* Should govern the key exchange process for two parties to generate a shared secret key */
};
