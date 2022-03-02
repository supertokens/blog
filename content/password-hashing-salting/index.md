---
title: How to hash, salt, and verify passwords in NodeJS, Python, Golang, and Java
date: "2022-03-02"
description: "How to hash and salt passwords in different languages and why it's important to do so"
cover: "password_hashing_and_salting.png"
category: "programming"
author: "SuperTokens Team"
discord_button_id: "discord_password_hashing_salting"
---

Storing passwords can be a nuance due to the liability of them being compromised. To make matters worse, users tend to reuse passwords across services which makes storing them securely even more important.

The aim behind storing passwords securely is that even if the database containing them is compromised, the attacker can’t decipher any user’s actual password. This rules out storing passwords in [plain text](https://en.wikipedia.org/wiki/Plaintext). 

Using encryption may seem to be a good choice since the attacker would not know the actual passwords (because they are encrypted). However, if the database is compromised, then the encryption keys would probably[^1] be compromised as well. Using these keys, the attacker would be able to decrypt the encrypted passwords - making this method of storage weak.

This is where hashing or hash functions come into play.

## What are hash functions?
They are functions that have these properties:

1) **Preimage resistance**: Given the output of a hash function `Out`, it should be hard to find any input `In`, which when hashed, results in the same output (`hash(In) = Out`). For example, if I take a random SHA256 hash output (`string` data type) like `"401357cf18542b4117ca59800657b64cce2a36d8ad4c56b6102a1e0b03049e97"`, it should be very hard to know what the input to the hash function was that resulted in this output. Try googling your way into finding it!

2) **Second preimage resistance**: If an input to a hash function is known, it should be hard to find another input that has the same hashed output.

3) **Collision resistance**: This says that it is hard to find any two inputs such that their hashed output is the same. This is slightly different from (2) since in (2), you are given one input, and in this case, you can cook up any input.

4) **Predictability**: The hash function should always return the same output given the same input.

5) **Fixed Length Output**: The output of the hash function always has the same length (number of chars), regardless of the input’s length.

6) **Input sensitivity**: A small change in the input (even just one character), should have a large change in the output string. For example, the SHA256 hash of `"hello"` is `"2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"`. But the hash of `"hella"` is `"70de66401b1399d79b843521ee726dcec1e9a8cb5708ec1520f1f3bb4b1dd984"`. As you can see, the outputs are verify different.

All in all, hash functions are “one-way functions”. If you only know the output, it’s impossible/difficult to know its input. This is unlike encryption in which given the output and the encryption key, you can know the input.

Due to this one-way property, storing a hashed value of a password is a good idea since if their hash is compromised (via a database leak), the attacker would not know the original password (which is the input to the hash function). In fact, the only “entity” which would know the input to the hash function would be the end user who generated the password in the first place. This is exactly what we want from a security point of view.

> Due to property number (5), there are an infinite number of inputs that can yield the same hash output. But it’s also very difficult to find any one of those infinite numbers of inputs given a specific output! 

## What is salting and why hashing alone is not good enough - Problems with humans
Many people tend to use [common passwords](https://nordpass.com/most-common-passwords-list/) like "password", "12345" etc. Since the hash of the same input never changes (see property (4) above), we can precompute the hash of common passwords and then check the leaked database data against those precomputed hashes. 

For example, the SHA256 hash of `"12345"` is `"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"`. If this hash is seen in a database, we know that the user’s password is `"12345"`[^2]. In fact, there is an entire database of precomputed hashes which can be checked against. These are called [rainbow tables](https://www.geeksforgeeks.org/understanding-rainbow-table-attack/).

The way to solve this problem is to add some random string, known as “salt”, to a password before hashing it (during the sign up process), and then we append that random string to the computed hash before storing it in the database. Let’s take an example:

- Alice’s password: `"12345"`
- Bob’s password: `"12345"`
- Alice’s random string (salt): `"ab$45"`
- Bob’s random string (salt): `"ih&g3"`
- Alice’s modified password: `"12345ab$45"`
- Bob’s modified password: `"12345ih&g3"`
- Alice’s SHA256 hash: `"2bb12bb768eb669f0e4b9df29e22a00467eb513c275ccfff1013288facac7889"`
- Bob’s SHA256 hash: `"b63400702c6f012aeaa57b5dc7eefaaaf3207cc6b68917911c410015ac0659b2"`

As you can see, their computed hashes are completely different, even though their passwords are the same. Most importantly, **these hashes won’t be in any rainbow table** since they are generated from fairly random strings (`"12345ab$45"` and `"12345ih&g3"`).

Before we store these hashes in the database, we must append the salt to them:
- Alice’s hash + salt: `"2bb12bb768eb669f0e4b9df29e22a00467eb513c275ccfff1013288facac7889.ab$45"`
- Bob’s hash + salt: `"b63400702c6f012aeaa57b5dc7eefaaaf3207cc6b68917911c410015ac0659b2.ih&g3"`

The reason we append the salt to the hash is so that during the verification process, we have to use the same salt as we did originally. So we must store this somewhere. Even if the salt is compromised, it’s not a security issue since the attacker would still need to know / guess the user’s password to be able to generate the same hash.

Let’s have a look at how the verification process happens:

- Alice’s password: `"abcdef"` (Incorrect password)
- Alice’s salt: `"ab$45"` (fetched from the db)
- Alice’s modified password: `"abcdefab$45"`
- Alice’s SHA256 hash: `"c5110931a3ae4762c1c0334d8eeba8c9c555962cf7d2750fdd732936319a058c"`
- Alice’s hash + salt: `"c5110931a3ae4762c1c0334d8eeba8c9c555962cf7d2750fdd732936319a058c.ab$45"`

Since the computed hash + salt doesn’t match the one in the database, we reject this password. If Alice was to enter her correct password (`"12345"`), it would indeed generate the same hash + salt as the one in the database, verifying her identity.


## Which hash function to choose?
Even after salting, the issue of brute force attacks still remain. An attacker could repeatedly guess different passwords (very quickly) to see which one matches the leaked hash. There are two dimensions that determine how quickly an attacker can find a match:
1) The randomness and length of the user’s password.
2) The time it takes for the hash function to compute the hash

If a user uses a random and long enough password, the chances of the attacker guessing that exact string reduces. This means they have to crunch through more guesses which will take more time. [Here is a really cool tool](https://www.passwordmonster.com/) which estimates how much time it would take to guess a given password.

The slower and more computationally expensive the hashing function, the more time it would take to validate each guess. As of this writing (2nd March, 2022), the recommended hashing technique is to use [Argon2id](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id) with a minimum configuration of 15 MiB of memory, an iteration count of 2, and 1 degree of parallelism[^3]. 

As computational power increases, recommended hashing techniques change as well. Even if the algorithm remains the same, the recommended number of “rounds”  / amount of “work” that should be done per password hash may increase.

## Example code

### NodeJS
```js
import * as argon2 from "argon2";
import * as crypto from "crypto";
 
const hashingConfig = { // based on OWASP cheat sheet recommendations (as of March, 2022)
    parallelism: 1,
    memoryCost: 64000, // 64 mb
    timeCost: 3 // number of itetations
}
 
async function hashPassword(password: string) {
    let salt = crypto.randomBytes(16);
    return await argon2.hash(password, {
        ...hashingConfig,
        salt,
    })
}
 
async function verifyPasswordWithHash(password: string, hash: string) {
    return await argon2.verify(hash, password, hashingConfig);
}
 
hashPassword("somePassword").then(async (hash) => {
    console.log("Hash + salt of the password:", hash)
    console.log("Password verification success:", await verifyPasswordWithHash("somePassword", hash));
});
```

The above produces the following output:
```bash
Hash + salt of the password: $argon2i$v=19$m=15000,t=3,p=1$tgSmiYOCjQ0im5U6NXEvPg$xKC4V31JqIK2XO91fnMCfevATq1rVDjIRX0cf/dnbKY
 
Password verification success: true
```

> If you run the above program, it will produce a different hash each time since the salt is regenerated each time.

### GoLang
```go
package main
 
import (
    "crypto/rand"
    "crypto/subtle"
    "encoding/base64"
    "errors"
    "fmt"
    "log"
    "strings"

    "golang.org/x/crypto/argon2"
)
 
type params struct {
    memory      uint32
    iterations  uint32
    parallelism uint8
    saltLength  uint32
    keyLength   uint32
}
 
func main() {
    p := &params{
        memory:      64 * 1024, // 64 MB
        iterations:  3,
        parallelism: 1,
        saltLength:  16,
        keyLength:   32,
    }

    encodedHash, err := generateHashFromPassword("somePassword", p)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Hash + salt of the password:")
    fmt.Println(encodedHash)

    match, err := verifyPassword("somePassword", encodedHash)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("\nPassword verification success: %v\n", match)
}
 
func generateHashFromPassword(password string, p *params) (encodedHash string, err error) {
    salt, err := generateRandomBytes(p.saltLength)
    if err != nil {
        return "", err
    }

    hash := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)

    // Base64 encode the salt and hashed password.
    b64Salt := base64.RawStdEncoding.EncodeToString(salt)
    b64Hash := base64.RawStdEncoding.EncodeToString(hash)

    // Return a string using the standard encoded hash representation.
    encodedHash = fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, p.memory, p.iterations, p.parallelism, b64Salt, b64Hash)

    return encodedHash, nil
}
 
func generateRandomBytes(n uint32) ([]byte, error) {
    b := make([]byte, n)
    _, err := rand.Read(b)
    if err != nil {
        return nil, err
    }

    return b, nil
}
 
func verifyPassword(password, encodedHash string) (match bool, err error) {
    // Extract the parameters, salt and derived key from the encoded password
    // hash.
    p, salt, hash, err := decodeHash(encodedHash)
    if err != nil {
        return false, err
    }

    // Derive the key from the other password using the same parameters.
    otherHash := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)

    // Check that the contents of the hashed passwords are identical. Note
    // that we are using the subtle.ConstantTimeCompare() function for this
    // to help prevent timing attacks.
    if subtle.ConstantTimeCompare(hash, otherHash) == 1 {
        return true, nil
    }
    return false, nil
}
 
func decodeHash(encodedHash string) (p *params, salt, hash []byte, err error) {
    vals := strings.Split(encodedHash, "$")
    if len(vals) != 6 {
        return nil, nil, nil, errors.New("the encoded hash is not in the correct format")
    }

    var version int
    _, err = fmt.Sscanf(vals[2], "v=%d", &version)
    if err != nil {
        return nil, nil, nil, err
    }
    if version != argon2.Version {
        return nil, nil, nil, errors.New("incompatible version of argon2")
    }

    p = &params{}
    _, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &p.memory, &p.iterations, &p.parallelism)
    if err != nil {
        return nil, nil, nil, err
    }

    salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])
    if err != nil {
        return nil, nil, nil, err
    }
    p.saltLength = uint32(len(salt))

    hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
    if err != nil {
        return nil, nil, nil, err
    }
    p.keyLength = uint32(len(hash))

    return p, salt, hash, nil
}
```

### Python
```python
import argon2

argon2Hasher = argon2.PasswordHasher(
    time_cost=3, # number of iterations
    memory_cost=64 * 1024, # 64mb
    parallelism=1, # how many parallel threads to use
    hash_len=32, # the size of the derived key
    salt_len=16 # the size of the random generated salt in bytes
)


password = "somePassword"
 
hash = argon2Hasher.hash(password)
 
print("Hash + salt of password", hash)
 
verifyValid = argon2Hasher.verify(hash, password)
print("Password verification success:", verifyValid)
```


### Java
```java
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
 
public class PasswordHashing {
    public static void main(String[] args) {
        // salt 32 bytes
        // Hash length 64 bytes
        Argon2 argon2 = Argon2Factory.create(
                Argon2Factory.Argon2Types.ARGON2id,
                16,
                32);

        char[] password = "somePassword".toCharArray();
        String hash = argon2.hash(3, // Number of iterations
                64 * 1024, // 64mb
                1, // how many parallel threads to use
                password);
        System.out.println("Hash + salt of the password: "+hash);
        System.out.println("Password verification success: "+ argon2.verify(hash, password));
    }
}
```


[^1]: Unless they are stored in a "secure vault" like this one. But then too, it’s still possible that they get leaked.

[^2]: Technically, the users password could be anything that, when hashed, results in `"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"`. But if we try and login with the password as `"12345"`, it would work since the algorithm is just matching the computed hash against the one in the database.

[^3]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
