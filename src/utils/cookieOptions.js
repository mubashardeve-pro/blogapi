const cookieOptions = {
  httpOnly: true,
  secure: true, // https se hi cookie send karna hai
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, //  hai cookie ko store karna hai
};

module.exports = { cookieOptions };
