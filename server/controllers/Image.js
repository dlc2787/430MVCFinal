const models = require('../models');

const { Image } = models;
const { Account } = models;

// display the uploads page where users can upload and view images
const uploadsPage = (req, res) => {
  Image.ImageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ooccured!' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), images: docs, slots: req.session.account.slots });
  });
};

// retrieve images from the database
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

// update a user's remaining image slots
const updateUserSlots = (req, res, slotChange) => {
  Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    if (err) {
      res.status(400).json({ error: 'Account not found' });
    }

    const user = doc;
    user.slots += slotChange;

    return updateDB(req, res, user);
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
  promise.then(() => updateUserSlots(req, res, -1));
  promise.catch((err) => {
    console.dir(err);
    res.status(400).json({ error: 'Error uploading' });
  });

  return promise;
};

// remove an image
const removeImage = (request, response) => {
  const req = request;
  const res = response;

  return Image.ImageModel.removeImage(req.body._id, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error Removing Image' });
    }

    return updateUserSlots(req, res, 1);
  });
};

// retrieves a single image by name and sends it to the user
const getImageByName = (request, response) => {
  const req = request;
  const res = response;

  if (!req.query.image) {
    return res.status(400).json({ error: 'Image Name Upspecified' });
  }

  return Image.ImageModel.findOne({ name: req.query.image }, (err, doc) => {
    if (err) {
      console.dir(err);
      return res.status(400).json({ error: `An error occured retrieving ${req.query.image}.` });
    }
    if (!doc) {
      return res.status(404).json({ error: `${req.query.image} not found!` });
    }

    res.writeHead(200, { 'Content-Type': doc.mimetype, 'Content-Length': doc.size });
    return res.end(doc.data);
  });
};

module.exports = {
  uploadsPage,
  getImages,
  uploadImage,
  getImageByName,
  removeImage,
};
