module.exports = {
  getUniqueFilename(filename) {
    const timestamp = Date.now();
    const extension = filename.split(".").pop();
    return `${timestamp}.${extension}`;
  },
};
