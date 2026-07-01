const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  // cross-origin (frontend + API alag domain) par cookie bhejne ke liye "none" zaroori hai
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

module.exports = { cookieOptions };
