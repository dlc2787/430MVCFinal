const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let ImageModel = {};

const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  data: {
    type: Buffer,
    required: true,
  },
  size: {
    type: Number,
    min: 0,
    required: true,
  },
  encoding: {
    type: String,
    required: true,
  },
  truncated: {
    type: Boolean,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  tempFilePath: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// formats image info for the api
ImageSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  _id: doc._id,
  mimetype: doc.mimetype,
});

// finds all images by a username
ImageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return ImageModel.find(search).select('name data mimetype').lean().exec(callback);
};

// removes an image from the database
ImageSchema.statics.removeImage = (imageId, callback) => {
  const toDelete = {
    _id: imageId,
  };
  return ImageModel.deleteOne(toDelete).exec(callback);
};

ImageModel = mongoose.model('ImageModel', ImageSchema);

module.exports = {
  ImageModel,
  ImageSchema,
};
