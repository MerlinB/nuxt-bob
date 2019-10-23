import bsv from "bsv";

export function isValidUser(user) {
  const pubKey = user.opReturn.s8;
  if (pubKey) {
    return bsv.PublicKey.isValid(pubKey);
  }
}
