import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not authorized. Please log in again." });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECERET);
    req.body.userId = decodeToken.id;
    next();
  } catch (error) {
    console.log(error);
    
    // Handle token expiry error separately
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    // Handle any other JWT verification errors
    return res.status(401).json({ message: 'Token invalid. Please log in again.' });
  }
};

export default authUser;
