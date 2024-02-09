const { UnauthenticatedError } = require('../errors');

const checkPermissions = (requestUser, resourceId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceId) return;
  throw new UnauthenticatedError("You don't have access to this route");
};

module.exports = checkPermissions;