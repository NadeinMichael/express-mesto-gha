const router = require('express').Router();

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validationCreateCard,
  validationDeleteCardById,
  validationLikeCard,
  validationDislikeCard,
} = require('../utils/validation');

router.get('/', getCards);

router.post('/', validationCreateCard, createCard);

router.delete('/:cardId', validationDeleteCardById, deleteCardById);

router.put('/:cardId/likes', validationLikeCard, likeCard);

router.delete('/:cardId/likes', validationDislikeCard, dislikeCard);

module.exports = router;
