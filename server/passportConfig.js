const jwt = require('jsonwebtoken');


if(process.env.NODE_ENV !='production'){
    require('dotenv').config()
}
const secret = process.env.SESSION_SECRET

function initizalize(req, res, next){
    const token =req.cookies.token;
    if(!token){
       res.status(401).send('Unauthorized') 
    }else{
        jwt.verify(token, secret, function (err, decoded) {
            if(err){
                res.status(401).send("Unauthorized")
            }else{
                req.email=decoded.email;
                next();
            }
            
        });
    }
    
} 

module.exports = initizalize