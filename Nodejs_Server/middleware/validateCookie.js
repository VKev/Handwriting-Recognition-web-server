validateCookie = function (req, res, next) {
  if (req.session.authenticated) {
    req.validateData = {
      validate: true,
      userrole: req.session.userrole,
      username: req.session.username,
    };
  } else {
    req.validateData = {
      validate: false,
      userrole: req.session.userrole,
      username: req.session.username,
    };
  }
  next();
};

module.exports = validateCookie;
