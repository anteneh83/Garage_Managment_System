const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
