const jwt = require('jsonwebtoken');


const secret = "secret"

function initizalize(req, res, next){
    const token =req.cookies.__session;
    if(!token){
        console.log("Token Not Found")
       res.status(401).send('Token not found') 
    }else{
        jwt.verify(token, secret, function (err, decoded) {
            if(err){
                console.log("Unauthorized")
                res.status(401).send("Unauthorized")
            }else{
                req.email=decoded.email;
                next();
            }
        });
    }
    
} 

module.exports = initizalize