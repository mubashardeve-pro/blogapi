const slugify = require('slugify');
const { categories } = require('../db/models');
const { AppError } = require('../utils/errorController');

const toSlug = (value) => slugify(value, { lower: true, strict: true });

const getAllCategories = async (req, res) => {
  const allCategories = await categories.findAll();
  res.status(200).json(allCategories);
};

const getCategoryById = async (req, res) => {
  const category = await categories.findByPk(req.params.id);

  if (!category) {
    throw AppError('Category not found', 404);
  }

  res.status(200).json(category);
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  const category = await categories.create({
    name,
    slug: toSlug(name),
  });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await categories.findByPk(req.params.id);

  if (!category) {
    throw AppError('Category not found', 404);
  }

  const { name } = req.body;

  await category.update({name});

  res.status(200).json(category);
};

const deleteCategory = async (req, res) => {
  const category = await categories.findByPk(req.params.id);

  if (!category) {
    throw AppError('Category not found', 404);
  }

  await category.destroy();
  res.status(204).send();
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};



