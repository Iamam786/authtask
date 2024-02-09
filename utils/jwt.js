const jwt = require('jsonwebtoken');

const createToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createToken({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('accessToken', token, {
    httpOnly: true,
    maxAge: oneDay,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = { createToken, isTokenValid, attachCookiesToResponse };