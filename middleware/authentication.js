const { UnauthenticatedError, UnauthorizedError } = require('../errors');
const { isTokenValid } = require('../utils');

const authenticatedUser = (req, res, next) => {
  const token = req.signedCookies.accessToken;
  
  if (!token) throw new UnauthenticatedError('Authentication Invalid');

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authentication Failed');
  }
};

const authorizePermissions = (...adminRoles) => {
  return (req, res, next) => {
    if (!adminRoles.includes(req.user.role)) throw new UnauthorizedError('You are not authorized to this route.');
    else next();
  };
};

module.exports = { authenticatedUser, authorizePermissions };