validateCookie = function (req, res, next) {
  if (req.session.authenticated) {
    req.validateData = { validate: true };
  } else {
    req.validateData = { validate: false };
  }
  next();
};

module.exports = validateCookie;
