function shutdown() {
  return new Promise(resolve => {
    setTimeout(resolve, 8000);
  });
}

module.exports = shutdown