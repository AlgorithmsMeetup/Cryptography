var Sender = function(keyLimit){
  keyLimit = keyLimit || 10
  this._privateInteger = Math.floor(Math.random() * keyLimit);
  this.partialKey = null;
  this._secretKey = null;
};

Sender.prototype.generatePartialKey = function(prime, base){
  this.partialKey = Math.pow(base, this._privateInteger) % prime;
};

Sender.prototype.generateSecretKey = function(prime, partialKey){
  this._secretKey = Math.pow(partialKey, this._privateInteger) % prime;
};

Sender.prototype.encryptMessage = function(plaintext){
  /* Should, letter by letter, convert the plaintext into ciphertext */
  var ciphertext = '';
  for(var i = 0; i < plaintext.length; i++){
    ciphertext += String.fromCharCode(this._secretKey ^ plaintext.charCodeAt(i));
  }
  return ciphertext;
};

Sender.prototype.decryptMessage = function(ciphertext){
  var plaintext = '';
  for(var i = 0; i < ciphertext.length; i++){
    plaintext += String.fromCharCode(this._secretKey ^ ciphertext.charCodeAt(i));
  }
  console.log(plaintext)
  return plaintext;
};

Sender.prototype.sendMessage = function(plaintext, recipient){
  /* Should generate the cipher text and send it to the recipient */
  /* (Hint:  see receiveMessage) */
  var ciphertext = this.encryptMessage(plaintext);
  console.log('Sender.sendMessage ciphertext', ciphertext);
  recipient.receiveMessage(ciphertext);
  return ciphertext;
};

Sender.prototype.receiveMessage = function(ciphertext){
  var plaintext = this.decryptMessage(ciphertext);
  return plaintext;
};

var exchangeKeys = function(alice, bob, prime, base){
  /* Should govern the key exchange process for two parties to generate a shared secret key */
  var prime = prime || 23;
  var base = base || 5;
  alice.generatePartialKey(prime, base);
  bob.generatePartialKey(prime, base);
  alice.generateSecretKey(prime, bob.partialKey);
  bob.generateSecretKey(prime, alice.partialKey)
};
