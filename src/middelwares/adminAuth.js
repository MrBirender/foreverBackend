import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ sucess: false, message: "un authorised user." });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECERET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ sucess: false, message: "un authorised user." });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
