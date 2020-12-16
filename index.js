require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const CRON = process.env.CRON
const cron = require('node-cron');
const price = require('./src/services/price.js');

app.use(cors())
global.pricing = 0;
global.ts = 0;

app.get('/', (req, res) => {
  res.json({price: global.pricing, date: global.ts})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

cron.schedule(CRON, () => {
    price().fetchPrice();
});