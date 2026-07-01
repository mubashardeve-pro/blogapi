const router = require('express').Router();

router.use('/authors', require('./authors.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/blogs', require('./blogs.routes'));



module.exports = router;