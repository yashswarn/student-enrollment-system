const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "missing or malformed token!!" });
  } else {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  }
};

// middleware to check allowed roles

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.sendStatus(401).json({ message: "unauthorized user" });
    } else {
      const userRole = req.user.role;

      const hasRole = userRole.some((role) => allowedRoles.includes(role));

      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "Access denied:Insufficient permisssion" });
      }
      next();
    }
  };
};
