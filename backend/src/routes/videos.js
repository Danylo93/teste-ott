const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Category = require('../models/Category');

router.post('/', async (req, res) => {
  try {
    const categories = await Category.find({
      name: { $in: req.body.categories }
    }).select('name'); 

    if (categories.length !== req.body.categories.length) {
      return res.status(400).send('Uma ou mais categorias são inválidas.');
    }

    const video = new Video({
      ...req.body,
      categories: categories.map(category => category.name) 
    });

    await video.save();
    res.status(201).send(video);
  } catch (error) {
    res.status(500).send('Erro ao criar o vídeo: ' + error.message);
  }
});


router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar vídeos');
  }
});

router.get('/:id', async (req, res) => {
    const video = await Video.findById(req.params.id);
    res.send(video);
  });

router.put('/:id', async (req, res) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body);
    res.send(video);
  });


router.post('/:categoryId/video', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title, description, videoUrl, thumbnail } = req.body;

    const video = new Video({ title, description, videoUrl, thumbnail });
    await video.save();

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Categoria não encontrada.');
    }
    category.videos.push(video._id);
    await category.save();

    res.status(201).send('Vídeo atribuído à categoria com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao atribuir vídeo à categoria: ' + error.message);
  }
});

router.put('/:videoId/category/:categoryId', async (req, res) => {
  const { videoId, categoryId } = req.params;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Vídeo não encontrado.');
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Categoria não encontrada.');
    }

    video.category = category.name;
    console.log('Associando:', video.category = category.name);
    await video.save();

    res.status(200).send('Categoria associada ao vídeo com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao associar categoria ao vídeo: ' + error.message);
  }
});


module.exports = router;
