const pbkdf2 = require("bsv/lib/mnemonic/pbkdf2");
const unorm = require("unorm");
const aesjs = require("aes-js");

function encrypt(string, password, salt) {
  const key = pbkdf2(unorm.nfkd(password), salt, 2048, 32);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key);
  const bytes = aesjs.utils.utf8.toBytes(string);
  const encrypted = aesCtr.encrypt(bytes);
  return aesjs.utils.hex.fromBytes(encrypted);
}

function decrypt(string, password, salt) {
  const key = pbkdf2(unorm.nfkd(password), salt, 2048, 32);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key);
  const bytes = aesjs.utils.hex.toBytes(string);
  const decrypted = aesCtr.decrypt(bytes);
  return aesjs.utils.utf8.fromBytes(decrypted);
}

module.exports = {
  encrypt,
  decrypt
};
