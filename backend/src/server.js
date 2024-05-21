const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const videoRoutes = require('./routes/videos');
const categoryRoutes = require('./routes/categories');
require('dotenv').config()

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(bodyParser.json());

app.use('/videos', videoRoutes);
app.use('/categories', categoryRoutes);


app.listen(3333, () => console.log('Server started on port 3333'));
