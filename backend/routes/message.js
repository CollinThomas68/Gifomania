const express = require('express');
const router = express.Router();
//lien vers le controller user
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post ('/', auth, multer, messageCtrl.creation);
//router.get('/', auth, messageCtrl.getAllArticle);
module.exports = router;