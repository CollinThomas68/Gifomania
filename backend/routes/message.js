const express = require('express');
const router = express.Router();
//lien vers le controller user
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post ('/creation',auth, multer, messageCtrl.creation);
router.get('/listing', messageCtrl.getAllMessage);
router.get('/choixModeration', messageCtrl.choixModeration);
router.get('/messageDetail/:id',messageCtrl.messageDetail);
router.delete('/suppression/:id',messageCtrl.suppressionMessage);
router.put('/highlight/:id',messageCtrl.Highlight);
module.exports = router;