const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
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

cron.schedule('0,20,40 * * * * *', () => {
    price().fetchPrice();
});