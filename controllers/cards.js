const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}` });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createCard = (req, res) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;

  Card.create(newCardData)
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}` });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id not found' });
      } else {
        res.status(500).send({ message: 'Server Error' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id not found' });
      } else {
        res.status(500).send({ message: 'Server Error' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Id not found' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
