const bcrypt = require("bcrypt");

const getUniqueFilename = (filename) => {
  const timestamp = Date.now();
  const extension = filename.split(".").pop();
  return `${timestamp}.${extension}`;
};

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, 8);
  return hash;
};

const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

module.exports = {
  getUniqueFilename,
  hashPassword,
  comparePassword,
};
