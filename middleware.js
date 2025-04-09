const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config');

function authMiddleware(req,res,next){
    //check for authorization token
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            message: "Invalid token"
        })
    }

    //Getting the token value out of bearer token
    const token = authHeader.split(' ')[1];

    try {
        //verify the jwt using JWT_SECRET
        const decoded = jwt.verify(token,JWT_SECRET);

        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }else{
            return res.status(403).json({
                message: "Invalid token"
            })
        }
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        })
    }
}

module.exports = authMiddleware

