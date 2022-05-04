const express = require('express');
const multer = require('multer');
const fs = require('fs');

const upload = multer();
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('AMP-Access-Control-Allow-Source-Origin', process.env.URL);
  res.append('Access-Control-Expose-Headers', ['AMP-Access-Control-Allow-Source-Origin']);
  next();
});

// This serves static files from the specified directory
app.use(express.static(__dirname + '/public'));

app.get('/productos/filter', (req, res) => {
  const filterType = req.query.category || 'all';
  const sortValue = req.query.sort || 'price-desc';
  const itemId = req.query.itemId || 'all';
  const products = fs.readFileSync(__dirname + '/json/products.json');
  const productsJSON = JSON.parse(products);
  const filteredItems = productsJSON.items.filter(item => filterType == 'all' ? true : item.type == filterType);
  const sortedFilteredItems = filteredItems.sort((a, b) => sortValue == 'price-asc' ? a.price - b.price : b.price - a.price);
  let filteredProducts = { "items": sortedFilteredItems }
  if (itemId != 'all') {
    filteredProducts = { "items": productsJSON.items.filter(item => item.id == itemId) };
  };
  res.send(JSON.stringify(filteredProducts));
});

app.post('/submit-form', upload.array(), (req, res) => {
  res.append('Content-Type', 'application/json');
  res.send(JSON.stringify(req.body));
});



const server = app.listen(8081, 'https://misadevflores.github.io/Creacion-de-una-lista-de-productos-filtrables-amp/', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at https://misadevflores.github.io/Creacion-de-una-lista-de-productos-filtrables-amp/', host, port);
});
