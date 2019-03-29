module.exports = function cacheControl(req, res, next) {
  if (process.env.CACHE_CONTROL) {
    res.header('Cache-Control', process.env.CACHE_CONTROL);
  }
  next();
};
