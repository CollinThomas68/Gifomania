var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET =process.env.JWT_Token ;

// Exported functions
module.exports = {

  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: function(authorization) {
    var userId = -1;//On définit un id que ne peut pas avoir un utilisateur
    var token = module.exports.parseAuthorization(authorization);
    if(token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);//On vérifie le token grâce à la méthode verify de jsonWebtoken
        if(jwtToken != null)
          userId = jwtToken.userId;//Si le token est correct et bien vérifié on récupère l'id utilisateur à l'intérieur et on le stocke dans userId
      } catch(err) { }
    }
    return userId;//Si userId ==-1 alors le token n'est pas bon et on retournera donc -1
                  //Si userId a une valeur logique, le token a bien été vérifié et on retournera donc l'id de l'utilisateur
  }
}