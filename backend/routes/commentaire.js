const express = require('express');
const router = express.Router();
//lien vers le controller commentaire
const commentaireCtrl = require('../controllers/commentaire');



router.post ('/creation/:id', commentaireCtrl.creation);
router.get('/listing/:id', commentaireCtrl.getAllCommentaires);

module.exports = router;