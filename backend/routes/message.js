const express = require('express');
const router = express.Router();
//lien vers le controller user
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post ('/creation', auth, multer, messageCtrl.creation);
router.get('/listing', auth, messageCtrl.getAllMessage);
router.get('/choixModeration', auth, messageCtrl.choixModeration);
router.get('/messageDetail/:id',auth,messageCtrl.messageDetail);
router.delete('/suppression/:id',auth,messageCtrl.suppressionMessage);
router.put('/highlight/:id',auth,messageCtrl.Highlight);
module.exports = router;