const express = require('express');
const router = express.Router();
//lien vers le controller user
const userCtrl = require('../controllers/user');
const bouncer = require ("express-bouncer")(500, 30000,3)
//bouncer.whitelist.push ("127.0.0.1");  Au cas où pour empêcher bouncer d'intervenir en local

router.post ('/inscription', userCtrl.inscription);
router.post('/authentification', bouncer.block, userCtrl.authentification);
router.get('/perso',userCtrl.perso);
router.delete('/suppression',userCtrl.suppression);
router.put('/verif',userCtrl.verif);
router.put('/modifmail',userCtrl.modifmail);
router.put('/modifpassword',userCtrl.modifpassword);
module.exports = router;