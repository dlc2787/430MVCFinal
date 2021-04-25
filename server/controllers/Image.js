const models = require('../models');

const { Image } = models;
const { Account } = models;

const makerPage = (req, res) => {
  Image.ImageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ooccured!' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), images: docs, slots: req.session.account.slots });
  });
};

/*
const make = (req, res) => {

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();
  domoPromise.then(() => res.json({ redirect: '/maker' }));
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo exists already!' });
    }
    return res.status(400).json({ error: 'An error occurred!' });
  });
  return domoPromise;
};
*/

const getImages = (request, response) => {
  const req = request;
  const res = response;

  return Image.ImageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ images: docs });
  });
};

// method for updating mongoDB with account info
const updateDB = (res, req, account) => {
  const savePromise = account.save();
  savePromise.then(() => {
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
  savePromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }

    return res.status(400).json({ error: 'An error occoured :(' });
  });
};

// upload a new image
const uploadImage = (request, response) => {
  const req = request;
  const res = response;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No file provided!' });
  }

  const { pic } = req.files;
  pic.owner = req.session.account._id;

  const newImage = new Image.ImageModel(pic);
  const promise = newImage.save();
  promise.then(() => {
    Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
      if (err) {
        res.status(400).json({ error: 'Account not found' });
      }

      const user = doc;
      user.slots = user.slots - 1;

      return updateDB(res, req, user);
    });
  });
  promise.catch((err) => {
    console.dir(err);
    res.status(400).json({ error: 'Error uploading' });
  });

  return promise;
};

module.exports = {
  makerPage,
  getImages,
  uploadImage,
};
