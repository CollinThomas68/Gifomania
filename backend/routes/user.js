const express = require('express');
const router = express.Router();
//lien vers le controller user
const userCtrl = require('../controllers/user');

router.post ('/inscription', userCtrl.inscription);
router.post('/authentification', userCtrl.authentification);
router.get('/perso',userCtrl.perso);

router.delete('/suppression',userCtrl.suppression);
router.put('/verif',userCtrl.verif);
router.put('/modifmail',userCtrl.modifmail);
router.put('/modifpassword',userCtrl.modifpassword);
module.exports = router;