var express = require('express');
var router = express.Router();

const promotionService = require('../services/promotionService');

router.post('/saveSchema', async function(req, res, next) {
  res.send(await promotionService.saveSchema(req.body.schema));
});

/* GET promotions listing. */
router.get('/', async function(req, res, next) {
  res.send(await promotionService.getPromotions(req.query));
});

router.post('/', async function(req, res, next) {
  res.send(await promotionService.savePromotion(req.body.promotion));
});

router.patch('/:id', async function(req, res, next) {
  console.log('jjjjjjjj', req.query, req.body);
  res.send(await promotionService.updatePromotion(req.query.id, req.body.promotion));
});

router.delete('/:id', async function(req, res, next) {
  res.send(await promotionService.deletePromotion(req.query.id));
});

router.post('/generateJson', async function(req, res, next) {
  res.send(await promotionService.generatePromotions(req.body.lastId, req.body.size));
});

module.exports = router;
