const express = require('express');
const app = express();
const https = require("https");
const PORT = 3000;

app.use(express.json());

const items = [
  { endpoint: 'https://tax.adventistas.org/pt/wp-json/wp/v2/menus/global-footer-1' },
  { endpoint: 'https://tax.adventistas.org/pt/wp-json/wp/v2/menus/global-footer-2' },
  { endpoint: 'https://tax.adventistas.org/pt/wp-json/wp/v2/menus/global-footer-3' },
];

// Get all items
app.get('/menus', async (req, res) => {
  try {
    const data = await Promise.all(items.map(getMenuData));
    let retorno = Array();

    for (let i = 0; i < data.length; i++) {
      let obj = data[i]["data"];

      let items = Array();
      for (let j = 0; j < obj["itens"].length; j++) {
        let item = obj["itens"][j];
        items.push({
          "id": item["ID"],
          "title": item["post_title"],
          "url": item["url"],
          "target": item["target"]
        });
      }

      retorno.push({
        "name": obj["name"],
        "items": items
      });
    }

    res.json(retorno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function getMenuData(item) {
  return new Promise((resolve, reject) => {
    let url = item.endpoint;
    let data = '';

    let request = https.get(url, response => {
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve({ endpoint: url, data: JSON.parse(data) });
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
}

app.post('/menus', async (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});