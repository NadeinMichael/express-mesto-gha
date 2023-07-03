const { celebrate, Joi } = require('celebrate');
const urlPattern = require('./patterns');

const validationSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    avatar: Joi.string().pattern(urlPattern),
  }),
});

const validationSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi
      .string()
      .required()
      .pattern(urlPattern),
  }),
});

const validationDeleteCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationDislikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().hex(),
  }),
});

const validationEditProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validationEditAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .required()
      .pattern(urlPattern),
  }),
});

module.exports = {
  validationSignup,
  validationSignIn,
  validationCreateCard,
  validationDeleteCardById,
  validationLikeCard,
  validationDislikeCard,
  validationGetUserById,
  validationEditProfile,
  validationEditAvatar,
};
