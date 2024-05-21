const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Video = require('../models/Video');

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
  try {
    const categoryId = req.params.id;

    // Encontra a categoria pelo ID
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).send({ message: 'Categoria não encontrada' });
    }

    // Remove a categoria dos vídeos que a contêm
    await Video.updateMany(
      { categories: categoryId },
      { $pull: { categories: categoryId } }
    );

    res.send({ message: 'Categoria excluída e atualizada nos vídeos' });
  } catch (error) {
    console.error('Erro ao excluir a categoria:', error);
    res.status(500).send({ message: 'Erro ao excluir a categoria' });
  }
});



module.exports = router;
