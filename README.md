###Encryption

When communicating data through middlemen and thirdparties (like when sending data over the internet), it’s important that we have a way of keeping our information safe.  We must confirm that the messages are complete, unaltered, authenticated, and sometimes even unread.  Fortunately for this, there are a number of cryptographic techniques that can help us ensure the integrity of our data and the messages we send across the wires.

####Uses of Encryption
When communicating across the internet, we must assume that everything we send is public information that could be intercepted and read by anyone.  It’s also possible for anyone to send a message, block a message, or potentially alter or replace a message.
To prevent eavesdropping, we encrypt our messages so they will be unintelligible to anyone without the decryption key.
To ensure completeness and authenticity, that is, that the sender of the message is who they say they are, we use digital signatures.

There are quite a few different approaches to generating keys, encrypting, and signing messages and they can all get fairly complicated.  They rely heavily on mathematical concepts and it’s very easy to run into issues when implementing encryption methods.  The best encryption techniques are not the ones that rely on obscure methods, but rather on strong mathematical techniques that are virtually impossible to reverse.  Here we will discuss the basics of a few techniques-- please consider them as an entry point to understanding how various techniques work rather than a fool-proof implementation of cryptographic protocols.


####Symmetric Key Exchange
In symmetric key encryption, the key used to encrypt a message is the same as the key used to decrypt a message.  This means that the keys must be kept secret, and cannot be exchanged openly.  A common implementation of symmetric key exchange is Diffie-Hellman, which is used in HTTPS/ SSL.

#####Diffie-Hellman
[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) is a technique used for two or more parties to generate matching secret keys without any prior communication history even in the presence of a third party.  It relies on a couple of shared (and openly communicated) pieces of information, and the rest is mathematically and secretly derived.  Here’s how:

1.  Both parties agree on a prime number p and a base g.  These are publicly known.
2.  Both parties then select a secret integer i, and perform the following operation:

        partialKey = g^i % p

3.  They then trade partial keys, and perform that same operation again, this time generating the shared secret

        secretKey = partialKey^i % p

Since both parties have performed the same operations, they now both hold the secret key, although it was never openly communicated.  This key can now be used to encrypt messages sent between the two of them.

#####One-time Pad
A [one-time pad](https://en.wikipedia.org/wiki/One-time_pad) is a method for encrypting a message that cannot be cracked when used properly.  Here, we will encrypt a message by combining the secret key with the plaintext message by a bitshifting operation-- specifically bitwise or (xor).  Bitwise or is the reverse of itself, so to decrypt the message, all we do is remove the key by performing the same operation, but this time with the ciphertext.

####Asymmetric Key Generation
Asymmetric key encryption, or public-private key encryption, is a method that allows anyone to send an encrypted message to a particular recipient.  Although the public and private keys are different, they are mathematically linked and can be used to reverse the effect of the other-- that is, we can use the public key to encrypt a message, and the private key to decrypt a message.

#####RSA Encryption
[RSA](https://en.wikipedia.org/wiki/RSA(cryptosystem)) is a cryptosystem (a set of techniques used for cryptographic protocols) that can be used to generate a public-private key pair as well as to sign a message.  Its security is based on the difficulty of factoring the product of very large prime numbers, which are used as the keys.  

The mathematical proof for how this works is rather rigorous, so we won’t worry about deriving that here.  What we should understand, though, is that prime numbers do not share any factors, and thus when we use them with exponents and modulo operations it is still possible to factor them out without losing the necessary information to decrypt messages.  Not only are these operations reversible, but they would also take a practically infinite amount of time to reverse without knowledge of the base prime numbers or keys used to encrypt the message.

You can read more in the above link on RSA for how to generate keys, but here’s a rough outline:

1.  Choose two distinct prime numbers, p and q.  These will serve as the base from which to calculate the public and private keys, as well as the modulus value.
2.  Compute:

        n = p * q
        n will be used as the modulus in the encryption and decryption algorithms

3.  Compute:

        phi = (p - 1) * (q - 1)
        phi is known as Euler’s Totient, and will be used to determine the public and private keys

4.  Choose a value (called e) between 1 and phi that shares no factors with phi (phi and e are coprime to each other)
5.  Calculate d, which is the modular multiplicative inverse of e.

e is released publicly as the public encryption key, and d is kept private as the private decryption key.  

To encrypt plaintext with RSA, we use the following equation:

    ciphertext = plaintext^e % n

And for decryption:

    plaintext = ciphertext^d % n

#####Digital Signatures
Using RSA to generate the public-private keys can ensure that no one other than the desired recipient can read the message, but gives the recipient no information about the sender of the message.  To authenticate the sender, use digital signatures.  Since the public and private keys can reverse each other, all we have to do as the sender of the message to sign it is encrypt a message with our private key, and include that along with the message we’re sending.  Then the recipient can unsign (by the same method as decryption) the signature by using our public key.  Then, if the unsigned signature and the message are the same, the recipient knows that we were in possession of the private key, and thus trust that we are who we say we are.