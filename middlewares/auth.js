const { verify } = require('crypto');
const jwt = require('jsonwebtoken');
var config = require('../config/constanct');


// const config = process.env
 verifyToken = (req,res,next) => {
  let token = req.headers["x-access-token"];
  console.log('token------', token)
  if (!token) {
      res.send({
        'status':400,
        message:"something went wrong in token"
      })

  }else{

  jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
          res.send({
            'status':400,
            Message:"auth token verification failed"
          })
      }
      req.userId = decoded.userId;
      next();
  })
}
};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt