const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isFirstUser = (await User.countDocuments()) === 0;

  const user = await User.create({ name, email, password, role: isFirstUser ? 'admin' : 'user' });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError('Please provide email and password');

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid Credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError('Invalid Credentials');

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = (req, res) => {
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    maxAge: 0,
  });
  res.status(StatusCodes.OK).json({ message: 'Logged out!' });
};

module.exports = { register, login, logout };
