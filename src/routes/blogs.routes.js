const router = require('express').Router();
const {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  addBlog,
  updateBlog,
  deleteBlog,
  getAuthorBlogs,
  getUploadUrl,
  uploadImage
} = require('../controllers/blogs.controllers');

router.post('/', addBlog);
router.get('/public', getAllBlogs);
router.get('/public/:slug', getBlogBySlug);
router.get('/author-blogs', getAuthorBlogs);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/uploads', uploadImage)
router.post('/uploads/presigned-url', getUploadUrl)
// router.post('/uploads/persigned-url', getUploadUrl)

module.exports = router;
