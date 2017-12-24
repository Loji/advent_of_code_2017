
const DIRECTIONS = {
	UP: 'up',
  DOWN: 'DOWN',
	RIGHT: 'right',
	LEFT: 'left',
};

const POSSIBLE = {
	infected: '#',
	healthy: '.',
	weakened: 'W',
	flagged: 'F',
};

class Crawler {
	constructor(x, y, direction, map) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.map = map;

		this.infectionCount = 0;
		this.dezinfectionCount = 0;
		this.flaggedCount = 0;
		this.weakenedCount = 0;
	}

	turnLeft() {
		switch (this.direction) {
			case DIRECTIONS.UP:
				this.direction = DIRECTIONS.LEFT;
				break;
			case DIRECTIONS.RIGHT:
				this.direction = DIRECTIONS.UP;
				break;
			case DIRECTIONS.DOWN:
				this.direction = DIRECTIONS.RIGHT;
				break;
			case DIRECTIONS.LEFT:
				this.direction = DIRECTIONS.DOWN;
				break;
		}
	}

	turnRight() {
		switch (this.direction) {
			case DIRECTIONS.UP:
				this.direction = DIRECTIONS.RIGHT;
				break;
			case DIRECTIONS.RIGHT:
				this.direction = DIRECTIONS.DOWN;
				break;
			case DIRECTIONS.DOWN:
				this.direction = DIRECTIONS.LEFT;
				break;
			case DIRECTIONS.LEFT:
				this.direction = DIRECTIONS.UP;
				break;
		}
	}

	revert() {
		switch (this.direction) {
			case DIRECTIONS.UP:
				this.direction = DIRECTIONS.DOWN;
				break;
			case DIRECTIONS.RIGHT:
				this.direction = DIRECTIONS.LEFT;
				break;
			case DIRECTIONS.DOWN:
				this.direction = DIRECTIONS.UP;
				break;
			case DIRECTIONS.LEFT:
				this.direction = DIRECTIONS.RIGHT;
				break;
		}
	}

	move() {
		const horizontal = direction => ({
			[DIRECTIONS.LEFT]: -1,
			[DIRECTIONS.RIGHT]: 1,
		})[direction] || 0;
		const vertical = direction => ({
			[DIRECTIONS.UP]: -1,
			[DIRECTIONS.DOWN]: 1,
		})[direction] || 0;

		this.x = this.x + horizontal(this.direction);
		this.y = this.y + vertical(this.direction);
	}

	iterate() {
		const currentTile = this._getCurrentTile();
		if (currentTile === POSSIBLE.healthy) {
			this.turnLeft();
			this.weakenedCount++;
			this._setCurrentTile(POSSIBLE.weakened)
		}
		if (currentTile === POSSIBLE.infected) {
			this.turnRight();
			this.flaggedCount++;
			this._setCurrentTile(POSSIBLE.flagged)
		}
		if (currentTile === POSSIBLE.flagged) {
			this.revert();
			this.dezinfectionCount++;
			this._setCurrentTile(POSSIBLE.healthy)
		}
		if (currentTile === POSSIBLE.weakened) {
			this.infectionCount++;
			this._setCurrentTile(POSSIBLE.infected)
		}
		this.move();
	}

	_setCurrentTile(char) {
		const line = this.map.get(this.y);
		line.set(this.x, char);
	}

	_getCurrentTile() {
		if (!this.map.has(this.y)) {
			this.map.set(this.y, new Map());
		}
		const line = this.map.get(this.y);
		if (!line.has(this.x)) {
			line.set(this.x, POSSIBLE.healthy);
			return POSSIBLE.healthy;
		}
		return line.get(this.x);
	}
}

const createMapFromFile = input => {
	const map = new Map();
	const lines = input.toString().split('\n');

	const height = Math.floor(lines.length / 2);

	lines.forEach((line, lineIndex) => {
		const width = Math.floor(line.length / 2);
		const linePosition = lineIndex - height;

		const lineMap = new Map();
		line.split('').forEach((char, charIndex) => {
			const charPosition = charIndex - width;
			lineMap.set(charPosition, char);
		});

		map.set(linePosition, lineMap);
	});
	return map;
};

const draw = (map, x, y) => {
	console.clear();

	map.forEach((line, lineIndex) => {
		let displayLine = '';
		line.forEach((char, charIndex) => {
			if (lineIndex === y && charIndex === x) {
				displayLine = `${displayLine}[${char}]`;
			} else {
				displayLine = `${displayLine} ${char} `;
			}
		});
		console.log(displayLine);
	})
}

const iterate = (crawler, index = 0) => new Promise((resolve, reject) => {
	draw(crawler.map, crawler.x, crawler.y);
	crawler.iterate();
	if (index > 100){//10000) {
		console.log(crawler.infectionCount);
	} else {
		setTimeout(() => iterate(crawler, index + 1), 50);
	}
});

require('fs').readFile('input', (err, data) => {
	if (err) throw err;
	const map = createMapFromFile(data);
	const crawler = new Crawler(0, 0, DIRECTIONS.UP, map);

	let i = 0;
	while (i < 10000000) {
		crawler.iterate();
		i++;
	}

	// iterate(crawler);
	console.log(crawler.infectionCount);

});
