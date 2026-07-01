const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

module.exports = { cookieOptions };
