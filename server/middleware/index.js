//require a user is signed in
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

//require a user is signed out
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/uploads');
  }
  return next();
};

//require HTTPS
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

//requrie the user has image spaces left
const validateSpace = (req, res, next) => {
  if (req.session.account.slots <= 0) {
    return res.redirect('/uploads');
  }
  return next();
};

//non-heroku methods
const bypassSecure = (req, res, next) => next();

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.validateSpace = validateSpace;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
