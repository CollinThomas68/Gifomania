const express = require('express');
const router = express.Router();
//lien vers le controller user
const userCtrl = require('../controllers/user');

router.post ('/inscription', userCtrl.inscription);
router.post('/authentification', userCtrl.authentification);
module.exports = router;