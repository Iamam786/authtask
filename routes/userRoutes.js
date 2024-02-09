const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

const { authenticatedUser, authorizePermissions } = require('../middleware/authentication');

router.route('/').get([authenticatedUser, authorizePermissions('admin')], getAllUsers);

router.route('/showMe').get(authenticatedUser, showCurrentUser);
router.route('/updateUser').patch(authenticatedUser, updateUser);
router.route('/updateUserPassword').patch(authenticatedUser, updateUserPassword);

router.route('/:userId').get(authenticatedUser, getSingleUser);

module.exports = router;