const JWT = require('jsonwebtoken');
const secret = 'shagun@1230';

function createTokenForUser(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        fullName: user.fullName
    }
    const token = JWT.sign(payload, secret);
    return token
};

function validateToken(token){
    const payload = JWT.verify(token,secret)
    return payload;
}

module.exports ={
    createTokenForUser,
    validateToken,
}