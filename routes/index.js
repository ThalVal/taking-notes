const router = require('express').Router();
const api = require('./apiRoutes.js');
const html = require('./htmlRoutes.js')

router.use('/', html)
router.use('/api', api);


module.exports = router