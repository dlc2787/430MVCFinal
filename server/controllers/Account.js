const models = require('../models');
const { AccountModel } = require('../models/Account');

const { Account } = models;

//404 not found
const handleNotFound = (req, res) => {
  res.redirect('/');
};

// render login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// log the current user out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// user log in
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/uploads' });
  });
};

// method for updating mongoDB with account info
const updateDB = (req, res, account) => {
  const savePromise = account.save();
  savePromise.then(() => {
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/uploads' });
  });
  savePromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }

    return res.status(400).json({ error: 'An error occoured :(' });
  });
};

// signup
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      slots: 3,
      password: hash,
    };

    const newAccount = new AccountModel(accountData);
    updateDB(req, res, newAccount);
  });
};

// change password
const updatePass = (request, response) => {
  const req = request;
  const res = response;

  const { username } = req.session.account;
  const password = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!username || !password || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password!' });
    }
    const user = account;

    return Account.AccountModel.generateHash(newPass, (salt, hash) => {
      user.salt = salt;
      user.password = hash;

      return updateDB(req, res, user);
    });
  });
};

// upgrade to a premium account
const upgradeAccount = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'Account not found' });
    }

    if (doc.premium) {
      return res.status(200).json({ error: 'Your account is already premium!' });
    }

    const user = doc;

    user.slots += 5;
    user.premium = true;

    return updateDB(req, res, user);
  });
};

// returns non-sensitive account info of the current user for displays
const getAccountInfo = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'Account not found' });
    }

    const account = {
      username: doc.username,
      slots: doc.slots,
      isPremium: doc.premium,
      created: doc.createdDate,
    };

    return res.status(200).json(account);
  });
};

// returns the csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  updatePass,
  upgradeAccount,
  getAccountInfo,
  handleNotFound,
};
