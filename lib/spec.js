var expect = chai.expect;

describe('symmetric key encryption', function(){
  context('generatePartialKey', function(){
    it('generates the partial key', function(){
      var alice = new Sender();
      alice._privateInteger = 7;
      var prime = 13;
      alice.generatePartialKey(prime, 17);
      expect(alice.partialKey).to.equal(4);
    });
  });
  context('generateSecretKey', function(){
    it('generates the secret key', function(){
      var alice = new Sender();
      alice._privateInteger = 7;
      alice.partialKey = 3;
      var prime = 13;
      alice.generateSecretKey(prime, alice.partialKey);
      expect(alice._secretKey).to.equal(3);
    });
  });
  context('encryptMessage', function(){
    it('returns ciphertext for given plaintext', function(){
      var alice = new Sender();
      alice._secretKey = 4;
      var encryptedMessage = alice.encryptMessage('secret message');
      expect(encryptedMessage).to.equal('wagvap$iawweca');
    });
    it('returns different ciphertext for different keys', function(){
      var alice = new Sender();
      alice._secretKey = 4;
      var encryptedMessage1 = alice.encryptMessage('secret message');
      alice._secretKey = 7;
      var encryptedMessage2 = alice.encryptMessage('secret message');
      expect(encryptedMessage1).not.to.equal(encryptedMessage2);
    });
  });
  context('decryptMessage', function(){
    it('returns plaintext for given ciphertext', function(){
      var alice = new Sender();
      alice._secretKey = 4;
      expect(alice.decryptMessage('wagvap$iawweca')).to.equal('secret message');
    });
  });
  context('sendMessage', function(){
    it('returns ciphertext for given ciphertext and passes it to recipient.receiveMessage', function(){
      var spy = sinon.spy(Sender.prototype, 'receiveMessage');
      var alice = new Sender();
      alice._secretKey = 4;
      var bob = new Sender();
      var plaintext = 'secret message';
      alice.sendMessage(plaintext, bob);
      expect(spy.called).to.be.true;
      expect(spy.args[0][0]).to.equal('wagvap$iawweca');
      Sender.prototype.receiveMessage.restore();
    });
  });
  context('receiveMessage', function(){
    it('returns plaintext for given ciphertext', function(){
      var alice = new Sender();
      alice._secretKey = 4;
      var ciphertext = 'wagvap$iawweca';
      var plaintext = alice.receiveMessage(ciphertext);
      expect(plaintext).to.equal('secret message');
    });
  });
  context('exchangeKeys', function(){
    it('sets up alice and bob with the same secret key by only disclosing prime, base, and each partial key', function(){
      var alice = new Sender();
      var bob = new Sender();
      exchangeKeys(alice, bob);
      expect(bob._secretKey).to.equal(alice._secretKey);
    });
  });
});

describe('asymmetric key encryption', function(){
  context('generateKeyPair', function(){
    it('generates the modulus', function(){
      var alice = new Identity();
      alice.generateKeyPair(3, 11);
      expect(alice.modulus).to.equal(33);
    });
    it('generates the public key', function(){
      var alice = new Identity();
      alice.generateKeyPair(3, 11);
      expect(alice.publicKey).to.equal(3);
    });
    it('generates the private key', function(){
      var alice = new Identity();
      alice.generateKeyPair(3, 11);
      expect(alice.privateKey).to.equal(7);
    });
  });
  context('encryptMessage', function(){
    it('returns ciphertext for given plaintext', function(){
      var encryptedMessage = encryptMessage('secret message', 7, 33);
      expect(encryptedMessage).to.equal('gqCiqnfmqggaDq');
    });
    it('returns different ciphertext for different keys', function(){
      var encryptedMessage1 = encryptMessage('secret message', 7, 33);
      var encryptedMessage2 = encryptMessage('secret message', 3, 33);
      expect(encryptedMessage1).not.to.equal(encryptedMessage2);
    });
  });
  context('signMessage', function(){
    it('returns an encrypted version of the message', function(){
      var alice = setupIdentity(7, 3, 33);
      var message = 'hello world';
      var signedMessage = alice.signMessage(message);
      expect(signedMessage).to.equal('Bqllufwuilj');
    });
    it('public key-encrypted messages cannot be decrypted by public key', function(){
      var alice = new Identity();
      var message = 'hello world';
      var encryptedMessage = encryptMessage(message, 3, 33);
      expect(decryptMessage(encryptedMessage, 3, 33)).not.to.equal(message);
    });
  });
  context('confirmAuthenticity', function(){
    it('returns true when text matches decrypted message for a given set of keys', function(){
      var alice = setupIdentity(7, 3, 33);
      var bob = setupIdentity(5, 5, 35);
      var message = 'hello world';
      var signedMessage = alice.signMessage(message); // todo actually provide fake signedMessage
      expect(confirmAuthenticity(message, signedMessage, alice.publicKey, alice.modulus)).to.be.true;
    });
    it('returns false when text does not match decrypted message for a given set of keys', function(){
      var alice = setupIdentity(7, 3, 33);
      var bob = setupIdentity(5, 5, 35);
      var message = 'hello world';
      var signedMessage = alice.signMessage(message);
      expect(confirmAuthenticity(message, signedMessage, bob.publicKey, bob.modulus)).to.be.false;
    });
  });
  context('decryptMessage', function(){
    it('returns plaintext for given ciphertext', function(){
      var alice = new Identity();
      var encryptedMessage = encryptMessage('secret message', 7, 33);
      expect(encryptedMessage).to.equal('gqCiqnfmqggaDq');
      var bob = new Identity();
      expect(decryptMessage(encryptedMessage, 3, 33)).to.equal('secret message');
    });
  });
  context('sendMessage', function(){
    it('returns plaintext for given ciphertext', function(){
      var spy = sinon.spy(Identity.prototype, 'receiveMessage');
      var alice = setupIdentity(7, 3, 33);
      var bob = setupIdentity(7, 3, 33);
      var message = 'my secret message';
      alice.sendMessage(message, bob);
      expect(spy.called).to.be.true;
      Identity.prototype.receiveMessage.restore();
    });
  });
  context('receiveMessage', function(){
    it('returns \'Identity not authenticated\' if cannot confirmAuthenticity', function(){
      var alice = setupIdentity(7, 3, 33);
      var bob = new Identity();
      var response = bob.receiveMessage('blahblah', 'something different', alice);
      expect(response).to.equal('Identity not authenticated');
    });
    it('returns plaintext for given ciphertext', function(){
      var alice = setupIdentity(7, 3, 33); //3,11
      var bob = setupIdentity(5, 5, 35); //7,17
      var plaintext = 'secret message';
      var sent = alice.sendMessage(plaintext, bob);
      expect(bob.receiveMessage(sent.ciphertext, sent.signature, alice)).to.equal(plaintext);
    });
  });
});

function setupIdentity (v, u, d) {
  var a = new Identity();
  a.privateKey = v;
  a.publicKey = u;
  a.modulus = d;
  return a;
};
