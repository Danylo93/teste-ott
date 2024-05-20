const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Category = require('../models/Category');

router.post('/', async (req, res) => {
  try {
    // Verifique se as categorias são válidas e existem no banco de dados
    const categories = await Category.find({
      name: { $in: req.body.categories }
    }).select('name'); // Seleciona apenas os IDs das categorias

    if (categories.length !== req.body.categories.length) {
      return res.status(400).send('Uma ou mais categorias são inválidas.');
    }

    // Crie um novo vídeo com as categorias
    const video = new Video({
      ...req.body,
      categories: categories.map(category => category.name) // Associe os IDs das categorias ao vídeo
    });

    await video.save();
    res.status(201).send(video);
  } catch (error) {
    res.status(500).send('Erro ao criar o vídeo: ' + error.message);
  }
});




// Rota para obter todos os vídeos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar vídeos');
  }
});


// Rota para obter um vídeo específico
router.get('/:id', async (req, res) => {
    const video = await Video.findById(req.params.id);
    res.send(video);
  });

// Rota para atualizar um video específico
router.put('/:id', async (req, res) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body);
    res.send(video);
  });

// Atribui um video a uma categoria:

router.post('/:categoryId/video', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title, description, videoUrl, thumbnail } = req.body;

    // Cria um novo vídeo
    const video = new Video({ title, description, videoUrl, thumbnail });
    await video.save();

    // Atribui o vídeo à categoria
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

// Rota PUT para associar uma categoria a um vídeo
router.put('/:videoId/category/:categoryId', async (req, res) => {
  const { videoId, categoryId } = req.params;

  try {
    // Encontra o vídeo pelo ID
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Vídeo não encontrado.');
    }

    // Encontra a categoria pelo ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Categoria não encontrada.');
    }

    // Associa a categoria ao vídeo
    video.category = category.name;
    console.log('Associando:', video.category = category.name);
    await video.save();

    res.status(200).send('Categoria associada ao vídeo com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao associar categoria ao vídeo: ' + error.message);
  }
});



module.exports = router;
