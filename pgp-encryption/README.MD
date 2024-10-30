
# PGP Encryption with Python

PGP (Pretty Good Privacy - great name isn’t it?) is a program for encryption that provides cryptographic privacy and authentication for data communication. PGP is used for signing, encrypting, and decrypting texts, e-mails, files, directories, and whole disk partitions and to increase the security of e-mail communications.

PGP is actually owned by Symantec, so it’s not free. That’s why OpenPGP exists. 

GnuPG is a free implementation of the OpenPGP standard that allows encryption and signing of data and communications. The OpenPGP defines standard formats for encrypted messages, signatures and certificates for exchanging public keys. It’s important to mention that this program serves as a framework to manage encryption, so in other words, PGP encryption doesn’t stand for an encryption algorithm. However, it can leverage encryption algorithms like the RSA algorithm.

## Environment setup

Python is required for this, so you may want to have it installed before going into this guide. 

We are going to use the `python-gnupg` library. To install it, run: `pip install python-gnupg`. The Python GnuPG library doesn’t require GnuPG binaries, so after installing Python and GnuPG library, you are all set.

## Using the Python GnuPG library

### Create a GPG instance

Import the GnuPG library and create a GPG instance
```py
import gnupg

gpg = gnupg.GPG()
```

If you are running many different instances of GPG in the same environment, you can define a home directory to have different keyrings for each instance.
```py
gpg = gnupg.GPG(gnupghome='/path/to/home')
```

You can define encoding
```py
gpg.encoding = 'utf-8'
```

### Generating a new key
```py
key_input = gpg.gen_key_input(
    # you will need a name and an email
    name_email="John Doe <john.doe@example.com>",
    # a password
    passphrase="password",
    # key type and length
    key_type="RSA",
    key_length=1024
)
key = gpg.gen_key(key_input)
```

### Exporting a key to a file
```py
with open('/path/to/export/key.asc', 'w', encoding='utf-8') as file:
    public_key = gpg.export_keys(str(key))
    file.write(public_key)
```

### Importing a key from a external file
```py
with open('/path/to/an/exported/key.asc', 'rb') as file:
    results = gpg.import_keys(file.read())
    gpg.trust_keys(results.fingerprints, 'TRUST_ULTIMATE')
```

### Listing all keys
```py
public_keys = gpg.list_keys()  # public keys only
# to access the fingerprint of one key.
fingerprint = public_keys[0]['fingerprint']
```

This method will return a standard Python list of dictionaries with the keys information. If you need to list private keys, you use `gpg.list_keys(True)`.

### Encrypting a string
```py
data = '{"name": "John Doe", "email": "john.doe@example.com"}'
# you will need to pass the data and the recipient (key ID)
encrypted = gpg.encrypt(data, recipients=[fingerprint])
# encrypted.data -> to access the encrypted data
```

This method will return a complex object which you can access the encrypted data in bytes format `encrypted.data`.

### Decrypting a raw file
```py
# you will need to pass in the encrypted data and the password used to encrypt it
decrypted = gpg.decrypt(encrypted.data, passphrase='password')
```

### Encrypting a file
```py
with open('/path/to/a/file/to/encrypt.txt', 'rb') as file:
    # you will need to a recipient which basically is an ID for the key
    # and the output path to a file to be created as a result of the encryption
    status = gpg.encrypt_file(
        file, recipients=[fingerprint], output='/path/to/a/file.encrypted')
    # status.ok is a boolean that indicates if the encryption was successful
```

### Decrypting a file
```py
with open('/path/to/a/file.encrypted', 'rb') as file:
    # you will need to pass the file,
    # the output file to serve as result file
    # and the password used to encrypt it
    status = gpg.decrypt_file(
        file, output='/path/to/a/file.decrypted', passphrase='password')
```

### Signing documents

You can also use this library to sign documents and verify signature, that way you can make sure the document you’ve received is really from the “person” you expected to.

```py
with open('/path/to/an/unsigned/data.txt', 'rb') as file:
    signed_data = gpg.sign_file(file)
```

### Verifying signature
```py
verified = gpg.verify(signed_data.data)  # bool
```

## Using the GPG command line

For this part, you need GnuPG binaries installed. You can find instructions [here](https://www.gnupg.org/download/).

> ⚠️ For Windows users, I couldn't install GnuPG binaries on my machine because of many different reasons. Below you can find instructions on how to setup WSL environment for GnuPG.

To list keys you can use: `gpg --list-keys`

To delete a key: `gpg --delete-key <fingerprint>`

To delete a secret key: `gpg --delete-secret-key <fingerprint>`

> ⚠️ You will need a fingerprint which you can get it by listing the keys.
> 
> There are some issues when deleting a key, because you need to revoke them before deleting. So be cautious. [Here](https://stackoverflow.com/questions/73293254/how-to-delete-gpg-keys-no-longer-needed) you can find more information about it.

To import a new key: `gpg --import <path/to/key.asc>`

To generate a new public and secret key: `gpg --full-generate-key`

> ⚠️ When adding a new secret key, it will require you to have its passphrase.

### WSL setup for GnuPG

When using WSL for the first time, I had some issues when running `apt update` or `apt upgrade`.

To move forward, I needed to edit a file with the command `sudo nano /etc/resolv.conf` by including a line like this `nameserver 8.8.8.8`.

Run Update: `sudo apt update`

Run Upgrade: `sudo apt upgrade`

Install Python on WSL: `sudo apt install python3 python3-pip ipython3`

Install GnuPG Binaries: `sudo apt install gnupg` and `sudo apt install -y ca-certificates wget`

Install python-gnupg library: `pip3 install python-gnupg`

## References

Here are some recommended documents and tutorials I used when learning this technology.

* [📃 Pretty Good Privacy](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)
* [📃 GNU Privacy Guard](https://en.wikipedia.org/wiki/GNU_Privacy_Guard)
* [📃 GnuPG](https://gnupg.org/ )
* [📃 GnuPG Documentation](https://gnupg.readthedocs.io/en/latest/)
* [📃 Python GnuPG Documentation](https://gnupg.readthedocs.io/en/latest/)
* [▶️ GPG/PGP Free Data Encryption with Python](https://youtu.be/9NiPwvLCDpM)