const router = require('express').Router();

const {
  getUsers, getUserById, createUser, editProfile, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUserById);

router.patch('/me', editProfile);

router.patch('/me/avatar', editAvatar);

module.exports = router;
