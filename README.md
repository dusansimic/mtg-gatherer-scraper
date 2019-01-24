# MTG Gatherer Search
> A simple search for getting card info form search on [Gatherer](http://gatherer.wizards.com).

## What is this?

MTG Gatherer Search is a simple search module that I use in my card database project. It scrapes search results from [Magic: The Gathering Gatherer](http://gatherer.wizards.com) portal for searching cards. It returns a json that contains essential card info: name, mana cost, image url and multiverse id. It's written in JavaSciprt as a module that can be used in Node.js or web frameworks.

## Usage

You can install mtg-gatherer-search via `npm` or `yarn` or any other Node.js package manager that connects to npm repository.

### Install
``` bash
$ npm i -P mtg-gatherer-search
```
or with Yarn
``` bash
$ yarn add mtg-gatherer-search
```

### Import

Once module is installed just import it into your JS file.
``` javascript
const mtgGathererSearch = require('mtg-gatherer-search');

// Or in ES6

import * as mtgGathererSearch from 'mtg-gatherer-search';
```

### Search

Now just call the function and get your search results in a json.
``` javascript
const result = await mtgGathererSearch('black');

/*
[
	{
		title: 'Black Lotus',
		mana: {
			Any: 0,
			Red: 0,
			White: 0,
			Green: 0,
			Blue: 0,
			Black: 0,
			Artifact: 0,
			Total: 0
		},
		imageUrl: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=382866&type=card',
		multiverseId: 382866
	},
	...
]

*/
```

## License

MIT © [Dušan Simić](http://dusansimic.me)
