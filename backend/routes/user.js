const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//lien vers le controller user
const userCtrl = require('../controllers/user');

router.post ('/inscription', userCtrl.inscription);
router.post('/authentification', userCtrl.authentification);
router.get('/perso/:id',auth,userCtrl.perso);
router.delete('/delete',auth,userCtrl.delete);

module.exports = router;