const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getImages', mid.requiresLogin, controllers.Image.getImages);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/uploads', mid.requiresLogin, controllers.Image.uploadsPage);
  app.post('/updatePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.updatePass);
  app.post('/upload', mid.requiresLogin, mid.requiresSecure, mid.validateSpace, controllers.Image.uploadImage);
  app.post('/upgrade', mid.requiresLogin, mid.requiresSecure, controllers.Account.upgradeAccount);
  app.get('/image', controllers.Image.getImageByName);
  app.post('/remove', mid.requiresLogin, mid.requiresSecure, controllers.Image.removeImage);
  app.get('/user', mid.requiresLogin, mid.requiresSecure, controllers.Account.getAccountInfo);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.Account.handleNotFound);
};

module.exports = router;
