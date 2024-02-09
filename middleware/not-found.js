const notFoundMiddleware = (req, res) => {
  res.send("Route doesn't exist");
};

module.exports = notFoundMiddleware;
 