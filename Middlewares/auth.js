const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

exports.verifyAdmin  =(req, res, next)=> {
  const role = req.user.role;
  if (role == "cashier") return res.status(403).json({ message: "Access denied" });
  next();
}