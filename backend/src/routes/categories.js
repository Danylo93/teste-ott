const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Video = require('../models/Video');

router.post('/', async (req, res) => {
  const existingCategory = await Category.findOne({ name: req.body.name });
  if (existingCategory) return res.status(400).send('Categoria já existe.');

  try {
    const category = new Category(req.body);
    await category.save();

    
    const videosToUpdate = await Video.find({ categories: { $in: req.body.name } });
    if (videosToUpdate.length > 0) {
      for (const video of videosToUpdate) {
        video.categories.push(category.name);
        await video.save();
      }
    }

    res.send(category);
  } catch (error) {
    console.error('Erro ao criar a categoria:', error);
    res.status(500).send({ message: 'Erro ao criar a categoria' });
  }
});

router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body);
  res.send(category);
});


router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).send({ message: 'Categoria não encontrada' });
    }

    await Video.updateMany(
      { categories: categoryId },
      { $pull: { categories: categoryId } }
    );

    res.send({ message: 'Categoria excluída e vídeos associados removidos' });
  } catch (error) {
    console.error('Erro ao excluir a categoria:', error);
    res.status(500).send({ message: 'Erro ao excluir a categoria' });
  }
});




module.exports = router;
