const roleAuth = (roles) => {
  return (req, res, next) => {
    // strict route for admin
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = roleAuth;
