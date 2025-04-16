module.exports = function requireRole(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient role." });
      }
      next();
    };
  };
  