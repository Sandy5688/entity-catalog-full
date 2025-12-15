// src/utils/textNormalizer.js

export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\b(inc|llc|ltd|pty|gmbh|sas)\b/g, '')
    .trim();
};
