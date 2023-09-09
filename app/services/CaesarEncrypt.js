/**
 * Encrypt each word by this algo
 */
export function encrypt_words(all_word_string, password, supported_chars = "") {
  const plains = all_word_string.split(' ')
  const encrypts = []
  plains.forEach(plain => {
    let encrypted, decrypted;

    // encrypt latin word only
    if (isLatinOnly(plain)) {
      encrypted = pass_encrypt(plain, password);
      decrypted = pass_decrypt(encrypted, password);
    } else {
      encrypted = plain
      decrypted = plain
    }

    encrypts.push(encrypted)
    // const fn = plain === decrypted ? console.info : console.error;
    // fn(`"${plain}", "${encrypted}", "${decrypted}"`)
  })
  return encrypts.join(' ')
}

/**
 * Encrypt each word by this algo
 */
export function decrypt_words(all_decrypted_string, password, supported_chars = "") {
  const decrypted_words = all_decrypted_string.split(' ')
  const plains = []
  decrypted_words.forEach(encrypted => {
    let plain;
    if (isLatinOnly(encrypted)) {
      plain = pass_decrypt(encrypted, password);
    }
    else {
      plain = encrypted
    }
    plains.push(plain)
    // console.log(`"decrypt_words: ${encrypted}" => "${plain}"`)
  })

  return plains.join(' ')
}

export function encrypt_string(plaintext, password, supported_chars = "") {
  return pass_encrypt(plaintext, password, supported_chars)
}
export function decrypt_string(encrypted_text, password, supported_chars = "") {
  return pass_decrypt(encrypted_text, password, supported_chars)
}

// only supported_chars was encrypted
export function pass_encrypt(plain_text, password, chars) {
  // console.log('{pass_encrypt} plain_text, password: ', plain_text, password);
  const normalized = base64_encode(plain_text)
  const pw_normalized = base64_encode(password)
  // console.log('{pass_encrypt} normalized, pw_normalized: ', normalized, pw_normalized);
  return caesar_cypher_with_password(normalized, pw_normalized, false, chars)
}
export function pass_decrypt(encrypted_text, password, chars) {
  // console.log('{pass_encrypt} plain_text, password: ', encrypted_text, password);
  const decrypted = caesar_cypher_with_password(encrypted_text, base64_encode(password), true, chars)
  const pw_normalized = base64_encode(password)
  // console.log('{pass_encrypt} decrypted, pw_normalized: ', decrypted, pw_normalized);
  return base64_decode(decrypted)
}

export function caesar_cypher_with_password(plain_text, password, decoding = false, supported_chars = '') {
  if (!supported_chars) {
    supported_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }
  const supported_chars_indexes = toDict(supported_chars);
  /**
   * encrypt/decrypt a single char
   * shift can be negative
   */
  function caesar_cypher(char, shift) {
    const prev_idx = supported_chars_indexes[char]
    const new_idx = (prev_idx + shift + supported_chars.length) % supported_chars.length;
    return supported_chars[new_idx];
  }
  function makeShiftValues(password) {
    const shifts = [];
    for(let i = 0, c = password.length; i < c; i++) {
      const charCode = supported_chars_indexes[password[i]];
      const shift = (charCode ?? 0) % supported_chars.length;
      shifts.push(shift);
    }
    return shifts;
  }
  // console.log('makeShiftValues', makeShiftValues(supported_chars + est_special_chars))

  /*
  * encode plain text with multiple shift values
  * In case of single shift: shifts = [shift_value]
  */
  function caesar_cypher_with_shifts(plain_text, shifts) {
    // console.log('{caesar_cypher_with_shifts} plain_text, shifts: ', plain_text, shifts);
    let encoded = '';
    if (!shifts.length) shifts.push(0); // no password mean not shifting

    for(let i =  0, c = plain_text.length; i < c; i++) {
      const char = plain_text[i];
      if (char in supported_chars_indexes) {
        const shift = shifts[i % shifts.length]
        encoded += caesar_cypher(char, shift)
      } else {
        // console.log('skip')
        encoded += char;
      }
    }

    // console.log('{caesar_cypher_with_shifts} encoded: ', encoded);

    return encoded;
  }

  let shifts = makeShiftValues(password);

  // shift of decoding is reversed compared to encoding
  if (decoding) {
    shifts = shifts.map(i => -i);
  }

  return caesar_cypher_with_shifts(plain_text, shifts)
}

// same as lodash
function toDict(arr) {
  const dict = {}
  for(let i = 0, c = arr.length; i < c; i++) dict[arr[i]] = i;
  return dict;
}
function base64_encode(plain) {
  return btoa(plain)
}
function base64_decode(encoded) {
  return atob(encoded)
}
function isLatinOnly(s) {
  for(let i = 0, c = s.length; i < c; i++) {
    if (s.charCodeAt(i) > 255) return false;
  }
  return true;
}
