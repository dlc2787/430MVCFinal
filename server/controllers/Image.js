const models = require('../models');

const { Image } = models;

const makerPage = (req, res) => {
  Image.ImageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ooccured!' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), images: docs });
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

//upload a new image
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
    res.status(201).json({ message: "Image uploaded!"});
  });
  promise.catch((err) => {
    console.dir(err);
    res.status(400).json({ error: "Error uploading"});
  });

  return res.json({ redirect: '/maker' });
};

module.exports = {
  makerPage,
  getImages,
  uploadImage,
};
