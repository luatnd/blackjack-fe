import {
  encrypt_words, decrypt_words,
  pass_encrypt, pass_decrypt,
  caesar_cypher_with_password,
} from './CaesarEncrypt'

import {
  pass_encrypt as pass_encrypt_old, pass_decrypt as pass_decrypt_old,
} from './CaesarEncryptOld'

const onlyBase64Chars = '[a-zA-Z0-9 +\\/=]'
function containSpecialChar(s) {
  return s.match(new RegExp(`^${onlyBase64Chars}+$`)) == null
}


describe('caesar_cypher_with_password', () => {
  test('can work with debug example', async () => {
    const password = "abc789"
    const plaintext = "abc 123 ABC 789"
    const encrypted = caesar_cypher_with_password(plaintext, password, false)
    const decrypted = caesar_cypher_with_password(encrypted, password, true)
    expect(decrypted).toEqual(plaintext)
    // expect(plaintext.split(" ").length).toEqual(encrypted.split(" ").length)
    expect(containSpecialChar(encrypted)).toEqual(false)
  })

  test('can encrypt and decrypt back', async () => {
    const password = "test my pass"
    const plaintext = "your mnemonic word phrases"
    const encrypted = caesar_cypher_with_password(plaintext, password, false)
    const decrypted = caesar_cypher_with_password(encrypted, password, true)
    expect(decrypted).toEqual(plaintext)
    expect(containSpecialChar(encrypted)).toEqual(false)
  })

  test('should skip the non-supported chars', async () => {
    const password = 'TestMyP@ss_complex'
    const plaintext = "contain special char #@#$%^ &*( _+()_ <:<>"
    const encrypted = caesar_cypher_with_password(plaintext, password, false)
    const decrypted = caesar_cypher_with_password(encrypted, password, true)
    expect(decrypted).toEqual(plaintext)
    console.log('{test special char} encrypted: ', encrypted);
    // expect non-supported chars appear in both encrypted & plaintext
    expect(encrypted.replace(new RegExp(onlyBase64Chars, 'g'), ''))
      .toEqual(plaintext.replace(new RegExp(onlyBase64Chars, 'g'), ''))
  })
})

describe('Old CaesarEncrypt', () => {
  test('can work with debug example', async () => {
    const password = "abc789"
    const plaintext = "abc 123 ABC 789"
    const encrypted = pass_encrypt_old(plaintext, password)
    const decrypted = pass_decrypt_old(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    // expect(plaintext.split(" ").length).toEqual(encrypted.split(" ").length)
    expect(containSpecialChar(encrypted)).toEqual(false)
  })

  test('can encrypt and decrypt back', async () => {
    const password = "test my pass"
    const plaintext = "your mnemonic word phrases"
    const encrypted = pass_encrypt_old(plaintext, password)
    const decrypted = pass_decrypt_old(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    expect(containSpecialChar(encrypted)).toEqual(false)
  })

  test('work with latin special chars', async () => {
    const password = 'TestMyP@ss_complex'
    const plaintext = "contain special char #@#$%^ &*( _+()_ <:<>"
    const encrypted = pass_encrypt_old(plaintext, password)
    const decrypted = pass_decrypt_old(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    console.log('{test special char} encrypted: ', encrypted);
    expect(containSpecialChar(encrypted)).toEqual(false)
  })
})


describe('New CaesarEncrypt', () => {
  test('can work with debug example', async () => {
    const password = "abc789"
    const plaintext = "abc 123 ABC 789"
    const encrypted = pass_encrypt(plaintext, password)
    const decrypted = pass_decrypt(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    // expect(plaintext.split(" ").length).toEqual(encrypted.split(" ").length)
    expect(containSpecialChar(encrypted)).toEqual(false)
  })


  test('can encrypt and decrypt back', async () => {
    const password = "test my pass"
    const plaintext = "your mnemonic word phrases"
    const encrypted = pass_encrypt(plaintext, password)
    const decrypted = pass_decrypt(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    expect(containSpecialChar(encrypted)).toEqual(false)
  })

  test('work with latin special chars', async () => {
    const password = 'TestMyP@ss_complex'
    const plaintext = "contain special char #@#$%^ &*( _+()_ <:<>"
    const encrypted = pass_encrypt(plaintext, password)
    const decrypted = pass_decrypt(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    console.log('{test special char} encrypted: ', encrypted);
    expect(containSpecialChar(encrypted)).toEqual(false)
  })


  test('can work with word by word', async () => {
    const password = 'TestMyP@ss_complex'
    const plaintext = "contain special char #@#$%^ &*( _+()_ <:<>"
    const encrypted = encrypt_words(plaintext, password)
    const decrypted = decrypt_words(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    console.log('{test special char} encrypted: ', encrypted);
    expect(containSpecialChar(encrypted)).toEqual(false)
  })
  test('tmp', async () => {
    const password = 'Go4'
    const plaintext = "lorem ipsum dol"
    const encrypted = encrypt_words(plaintext, password)
    const decrypted = decrypt_words(encrypted, password)
    expect(decrypted).toEqual(plaintext)
    console.log('{test special char} encrypted: ', encrypted);
    expect(containSpecialChar(encrypted)).toEqual(false)
  })
})

