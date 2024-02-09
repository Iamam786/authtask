const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) throw new NotFoundError(`No User found with ${userId}`);

  checkPermissions(req.user, userId);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select('-password');
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.email = email;

  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) throw new BadRequestError('Please enter both passwords');
  if (oldPassword === newPassword) throw new BadRequestError('Your old and new password are same.');

  const user = await User.findOne({ _id: req.user.userId });

  isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) throw new UnauthenticatedError('Incorrect old password');

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password successfully changed.' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};