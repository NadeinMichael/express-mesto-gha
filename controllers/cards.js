const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const newCardData = req.body;
  newCardData.owner = req.user.id;

  Card.create(newCardData)
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}` }));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card not found'));
      }
      if (req.user.id !== card.owner.toString()) {
        return next(new ForbiddenError('Нет прав на удаление данной карточки'));
      }
      return card.deleteOne()
        .then((deletedCard) => {
          res.status(200).send({ data: deletedCard });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Id not found'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card not found'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Id not found'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card not found'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Id not found'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
