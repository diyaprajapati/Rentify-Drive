const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // token verification
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // extract and verify the token
    const onlyToken = token.split(" ")[1];
    const decoded = jwt.verify(onlyToken, JWT_SECRET);

    // attach user info to req.user
    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    // console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
