const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//lien vers le controller user
const userCtrl = require('../controllers/user');

router.post ('/inscription', userCtrl.inscription);
router.post('/authentification', userCtrl.authentification);
router.get('/perso',auth,userCtrl.perso);

router.delete('/suppression',auth,userCtrl.suppression);
router.put('/verif',auth,userCtrl.verif);
router.put('/modifmail',auth,userCtrl.modifmail);
//router.put('/modifPassword',auth,userCtrl.modifPassword);
module.exports = router;