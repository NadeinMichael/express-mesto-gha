const router = require('express').Router();

const {
  getUsers, getUserById, editProfile, editAvatar, getMyInfo,
} = require('../controllers/users');
const {
  validationGetUserById,
  validationEditProfile,
  validationEditAvatar,
} = require('../utils/validation');

router.get('/', getUsers);

router.get('/me', getMyInfo);

router.get('/:userId', validationGetUserById, getUserById);

router.patch('/me', validationEditProfile, editProfile);

router.patch('/me/avatar', validationEditAvatar, editAvatar);

module.exports = router;
