const got = require('got');
const $ = require('cheerio');

/**
 * MTG Gatherer Scraper
 * @param {String} cardName Name of the card you search for
 */
const mgs = async cardName => {
	// If card name is not specified, scream
	const hasCardName = Boolean(cardName);
	if (!hasCardName) {
		throw new Error('Card name not specified!');
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

	return data;
};

module.exports = mgs;
