const { validateToken } = require('../services/auth')

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next()
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        }
        catch (error) { console.log(error,"authentication middleware error")}
        next()
    }
}

const fetchUser = async (req, res, next) => {
    const token = req.header("token");
    // console.log("token", token);
  
    if (!token) {
      res.status(401).json({ error: "Authenticate using valid token" });
    } else {
      try {
        const data = validateToken(token);
        req.user = data;
        next();
      } catch (error) {
        res.status(401).json({ error: "Authenticate using valid token" });
      }
    }
  };
  

module.exports = {
    checkForAuthenticationCookie,
    fetchUser
}