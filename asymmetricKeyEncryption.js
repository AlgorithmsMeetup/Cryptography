var Identity = function(){
  this.privateKey = null;
  this.publicKey = null;
  this.modulus = null;
};

Identity.prototype.generateKeyPair = function(p, q){
  /* Should calculate the private and public key, and store them on the Identity */
  var prime1 = p;
  var prime2 = q;
  this.modulus = prime1 * prime2;
  var phi = (prime1 - 1) * (prime2 - 1);
  this.publicKey = findCoprime(phi);
  this.privateKey = calculateModInverse(this.publicKey, phi);
};

Identity.prototype.signMessage = function(text){
  /* Given text, generate and return the senders signature */
  var signature = encryptMessage(text, this.privateKey, this.modulus);
  return signature;
};

Identity.prototype.sendMessage = function(plaintext, recipient){
  /* Given plaintext and a recipient, sendMessage should follow all the necessary protocols for it to be securely sent, and then send the message */
  /* (Hint: look at receiveMessage) */
  var ciphertext = encryptMessage(plaintext, recipient.publicKey, recipient.modulus);
  var signature = this.signMessage(ciphertext);
  recipient.receiveMessage(ciphertext, signature, this);
  return {signature: signature, ciphertext: ciphertext, sender: this};
};

Identity.prototype.receiveMessage = function(ciphertext, signature, sender){
  /* Given the ciphertext, signature, and sender, receiveMessage should determine the integrity of the message and selectively read and return the content. */
  var authentic = confirmAuthenticity(ciphertext, signature, sender.publicKey, sender.modulus);
  if(!authentic){
    console.log('Identity not authenticated');
    return 'Identity not authenticated';
  }
  var plaintext = decryptMessage(ciphertext, this.privateKey, this.modulus);
  return plaintext;
};

var encryptMessage = function(plaintext, key, modulus){
  /* Should turn plaintext into ciphertext according to the RSA protocol and return it */
  var ciphertext = '';
  var encryptedLetter
  for(var i = 0; i < plaintext.length; i++){
    encryptedLetter = Math.pow(letterToNumber(plaintext[i]), key) % modulus;
    ciphertext += numberToLetter(encryptedLetter);
  }
  return ciphertext;
};

var decryptMessage = function(ciphertext, key, modulus){
  /* Should turn ciphertext into plaintext according to the RSA protocol and return it */
  var plaintext = '';
  var decryptedLetter
  for(var i = 0; i < ciphertext.length; i++){
    decryptedLetter = Math.pow(letterToNumber(ciphertext[i]), key) % modulus;
    var x = numberToLetter(decryptedLetter);
    plaintext += x;
  }
  return plaintext;
};

var confirmAuthenticity = function(text, signature, key, modulus){
  /* Should confirm that the sender is who they claim to be */
  var unsignature = decryptMessage(signature, key, modulus);
  if(unsignature === text) return true;
  return false;
};

/*******************************************/
// It's dangerous to go alone!  Take these!//
//           HELPER FUNCTIONS              //
//           (do not modify)               //
/*******************************************/
var letterToNumber = function(letter){
  return letters.indexOf(letter);
};

var numberToLetter = function(number){
  if(number >= letters.length){
    number = number % letters.length; // TODO
  } else {
  }
  return letters[number];
};
var findCoprime = function(number){
  for(var i = 2; i < number; i++){
    if( determineIfCoprime(i, number) ){
      return i
    }
  }
};

/*******************************************/
//        HELPER HELPER FUNCTIONS          //
//        (you won't use these)            //
//           (do not modify)               //
/*******************************************/
var determineIfCoprime = function(a, b){
  var factorsa = factor(a);
  var factorsb = factor(b);
  delete factorsa[1];
  delete factorsb[1];
  var smaller = Object.keys(factorsa) < Object.keys(factorsb) ? factorsa : factorsb;
  var larger = Object.keys(factorsa) < Object.keys(factorsb) ? factorsb : factorsa;
  for(var value in smaller){
    if(value in larger) return false
  }
  return true;
};

var factor = function(number){
  var primes = {};
  for(var i = 0; i <= Math.sqrt(number); i++){
    if(number % i === 0){
      primes[i] = true;
      primes[number / i] = true;
    }
  }
  primes[number] = true
  return primes
};

calculateModInverse = function(number, mod){
  for(var i = 1; i < mod; i++){
    if(number * i % mod === 1) return i
  }
};

var validLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
var extendedLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']'];
var letters = validLetters.concat(extendedLetters)
