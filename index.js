const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const got = require('got');
const $ = require('cheerio');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());

app.get('/:cardName', async (req, res) => {
	try {
		// Get card name
		const {cardName} = req.params;
		// If card name is not specified, scream
		const hasCardName = Boolean(cardName);
		if (!hasCardName) {
			return res.status(400).send('Card name not specified!');
		}

		// Get Magic Gatherer search page html
		const response = await got.get(`http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${cardName}]`);
		const document = response.body;

		// Query table from html
		const table = $('.cardItemTable tbody tr td table tbody .cardItem.evenItem', document);
		// Get middle and left col from table
		const middleCol = $('.middleCol .cardInfo', table)
		const leftCol = $('.leftCol', table);

		// Get titles of cards
		const titleDocument = $('.cardTitle a', middleCol);

		const data = [];
		for (let i = 0; i < table.length; i++) {
			// Get mana html for current card
			const manaDocument = $('.manaCost img', middleCol[i]);

			// Parse that mana html
			const manaList = [];
			for (let j = 0; j < manaDocument.length; j++) {
				manaList.push(manaDocument[j].attribs.alt);
			}
			const manaTypes = ['Any', 'Red', 'White', 'Green', 'Blue', 'Black', 'Artifact', 'Total'];
			const mana = {};
			for (const type of manaTypes) {
				mana[type] = manaList.reduce((acc, val) => {
					// Count total number of mana
					if (type === 'Total') {
						return !isNaN(val) ? acc + parseInt(val, 10) : acc + 1;
					} else if (type === 'Any' && !isNaN(val)) {
						// Count colorless
						return parseInt(val, 10);
					} else if (val === type) {
						// Count color
						return acc + 1;
					}
					return acc;
				}, 0);
			}

			// Get the image url
			const imageUrlRelative = $('a img', leftCol[i])[0].attribs.src;
			const imageUrl = `http://gatherer.wizards.com/${imageUrlRelative.slice(6)}`;

			// Get id out of image url
			const multiverseId = parseInt(imageUrlRelative.slice(imageUrlRelative.indexOf('multiverseid=') + 13, -10), 10);

			// Create an object
			const object = {
				title: titleDocument[i].children[0].data,
				mana,
				imageUrl,
				multiverseId
			};
			data.push(object);
		}

		res.send(data);
	} catch (error) {
		res.status(500).send(new Error(error));
	}
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', error => {
	if (error) {
		throw error;
	}
	console.log(`Listening on ${PORT}`);
})
