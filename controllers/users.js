const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return next(new NotFoundError('Users not found'));
      }
      return res.status(200).send(users);
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Id not found'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      const { _id } = newUser;
      res.send({
        name: newUser.name, about: newUser.about, avatar: newUser.avatar, _id, email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не удалось создать пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой email уже есть в базе данных'));
      } else {
        next(err);
      }
    });
};

const editProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, { name: req.body.name, about: req.body.about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: `${Object.values(err.errors).map((e) => e.message).join('. ')}` }));
      } else {
        next(err);
      }
    });
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch((err) => next(err));
};

const editAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: `${Object.values(err.errors).map((e) => e.message).join('. ')}` }));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Не передан Email или пароль'));
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверные пароль или email'));
      }

      return bcrypt.compare(password, user.password, (error, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return next(new UnauthorizedError('Неверные пароль или email'));
        }

        const token = generateToken(user._id);
        return res.status(200).send({ token });
      });
    })
    .catch((err) => next(err));
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
