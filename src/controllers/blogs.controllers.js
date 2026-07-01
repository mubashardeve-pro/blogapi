const { Op } = require('sequelize');
const slugify = require('slugify');
const { blogs, authers, categories } = require('../db/models');
const { AppError } = require('../utils/errorController');
const { genUploadPresignedUrl, uploadToS3 } = require("../utils/s3")
const DEFAULT_BLOG_IMAGE_URL = "https://placehold.co/1200x630/png?text=Blog+Image"

const toSlug = (value) => slugify(value, { lower: true, strict: true });

const resolveSlug = async (title, slug, blogId, currentSlug) => {
  let nextSlug =
    slug?.trim() ||
    (title && title !== "Untitled" ? toSlug(title) : currentSlug) ||
    generateRandomSlug();

  if (!nextSlug) {
    nextSlug = generateRandomSlug();
  }

  let candidate = nextSlug;
  let suffix = 1;

  while (
    await blogs.findOne({
      where: {
        slug: candidate,
        ...(blogId ? { id: { [Op.ne]: blogId } } : {}),
      },
    })
  ) {
    candidate = `${nextSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const generateRandomSlug = () => {
  return Math.random().toString(36).substring(2, 9);
}

const blogIncludes = [
  { model: authers, as: 'author', attributes: ['name'] },
  { model: categories, as: 'category', attributes: ['name', 'slug'] },
];

const getAllBlogs = async (req, res) => {
  const allBlogs = await blogs.findAll({
    where: { is_published: true },
    include: blogIncludes,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'slug', 'createdAt', 'description', 'image_url'],
  });
  res.status(200).json(allBlogs);
};

const getAuthorBlogs = async (req, res) => {
  const authorBlogs = await blogs.findAll({
    where: { author_id: req.author.id },
    include: blogIncludes,
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json(authorBlogs);
};

const getBlogBySlug = async (req, res) => {
  const blog = await blogs.findOne({
    where: { slug: req.params.slug, is_published: true },
    include: blogIncludes,
  });

  if (!blog) {
    throw AppError('Blog not found', 404);
  }

  res.status(200).json(blog);
};

const getBlogById = async (req, res) => {
  const blog = await blogs.findByPk(req.params.id, { include: blogIncludes });

  if (!blog) {
    throw AppError('Blog not found', 404);
  }

  res.status(200).json(blog);
};

const getUploadUrl = async (req, res) => {
  const { fileName, contentType } = req.body;

  if (!fileName || !contentType) {
    throw AppError('fileName and contentType are required', 400);
  }

  const { url, key, imageUrl } = await genUploadPresignedUrl(
    fileName,
    contentType
  );

  res.json({ uploadUrl: url, imageUrl, key });
};

const uploadImage = async (req, res) => {
  const { fileName, contentType, data } = req.body;

  if (!fileName || !contentType || !data) {
    throw AppError('fileName, contentType and data are required', 400);
  }

  const buffer = Buffer.from(data, "base64");

  if (!buffer.length) {
    throw AppError('Invalid image data', 400);
  }

  const { key, imageUrl } = await uploadToS3(fileName, contentType, buffer);

  res.status(201).json({ key, imageUrl });
};

const addBlog = async (req, res) => {
  const { title, description, category_id, image_url } = req.body;

  const [uncategorizedCategory] = await categories.findOrCreate({
    where: { slug: "uncategorized" },
    defaults: { name: "Uncategorized", slug: "uncategorized" },
  });

  const blogTitle = title?.trim() || "Untitled";
  const blogSlug = await resolveSlug(
    blogTitle,
    blogTitle !== "Untitled" ? toSlug(blogTitle) : null,
    null,
    generateRandomSlug()
  );

  const blog = await blogs.create({
    title: blogTitle,
    description: description || "No description",
    image_url: image_url || DEFAULT_BLOG_IMAGE_URL,
    author_id: req.author.id,
    category_id: category_id || uncategorizedCategory.id,
    slug: blogSlug,
  });

  const createdBlog = await blogs.findByPk(blog.id, { include: blogIncludes });
  res.status(201).json(createdBlog);
};

const updateBlog = async (req, res) => {
  const blog = await blogs.findByPk(req.params.id);

  if (!blog) {
    throw AppError('Blog not found', 404);
  }

  if (blog.author_id !== req.author.id) {
    throw AppError('You are not allowed to update this blog', 403);
  }

  const { title, description, author_id, slug, category_id, is_published, image_url } = req.body;

  const updates = {};

  if (title !== undefined) {
    updates.title = title;
    updates.slug = await resolveSlug(title, slug, blog.id, blog.slug);
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (author_id !== undefined) {
    updates.author_id = author_id;
  }

  if (category_id !== undefined) {
    updates.category_id = category_id;
  }

  if (is_published !== undefined) {
    updates.is_published = is_published;
  }

  if (image_url !== undefined && image_url) {
    updates.image_url = image_url;
  }

  await blog.update(updates);

  const updatedBlog = await blogs.findByPk(blog.id, { include: blogIncludes });
  res.status(200).json(updatedBlog);
};

const deleteBlog = async (req, res) => {
  const blog = await blogs.findByPk(req.params.id);

  if (!blog) {
    throw AppError('Blog not found', 404);
  }

  if (blog.author_id !== req.author.id) {
    throw AppError('You are not allowed to delete this blog', 403);
  }

  await blog.destroy();
  res.status(204).send();
};

module.exports = {
  getAllBlogs,
  getAuthorBlogs,
  getBlogById,
  getBlogBySlug,
  addBlog,
  updateBlog,
  deleteBlog,
  getUploadUrl,
  uploadImage
};
