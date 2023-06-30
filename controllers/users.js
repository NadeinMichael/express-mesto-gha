const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(404).send({ message: 'Users not found' });
      }
      return res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id not found' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;
  const { email, password } = newUserData;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан Email или пароль' });
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'пользователь с таким Email уже существует' });
      }

      return bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        newUserData.password = hash;
        return User.create(newUserData)
          .then((newUser) => {
            res.status(201).send(newUser);
          })
          .catch((error) => {
            if (error.name === 'ValidationError') {
              return res.status(400).send({ message: `${Object.values(error.errors).map((e) => e.message).join('. ')}` });
            }
            return res.status(500).send({ message: 'На сервере произошла ошибка' });
          });
      });
    });
};

const editProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}` });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getMyInfo = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id not found' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const editAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}` });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не пераданы пароль или email' });
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неверные пароль или email' });
      }

      return bcrypt.compare(password, user.password, (error, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return res.status(401).send({ message: 'Неверные пароли или email' });
        }

        const token = generateToken(user._id);
        return res.status(200).send({ token });
      });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
  getMyInfo,
  login,
};
