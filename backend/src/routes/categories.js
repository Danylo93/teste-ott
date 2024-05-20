const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Rota para criar nova categoria
router.post('/', async (req, res) => {
  // Verifique se a categoria já existe
  const existingCategory = await Category.findOne({ name: req.body.name });
  if (existingCategory) return res.status(400).send('Categoria já existe.');

  // Se a categoria não existir, crie uma nova
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});

// Rota para obter todas as categorias
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

// Rota para atualizar uma categoria específica
router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body);
  res.send(category);
});



// Rota para excluir uma categoria específica
router.delete('/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.send({ message: 'Category deleted' });
});


module.exports = router;
