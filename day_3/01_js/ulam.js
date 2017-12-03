'use strict';

const directions = {
	right: 'right',
	up: 'up',
	left: 'left',
	down: 'down',
};

const getNewDirection = direction => ({
	up: directions.left,
	left: directions.down,
	down: directions.right,
	right: directions.up,
}[direction]);

const moveByDirection = (position, direction) => ({
	up: { x: position.x, y: position.y + 1 },
	left: { x: position.x - 1, y: position.y },
	down: { x: position.x, y: position.y - 1 },
	right: { x: position.x + 1, y: position.y },
}[direction]);

const getInitialUlam = () => {
	const ulam = new Map();
	const row = new Map();
	row.set(0, 1);
	row.set(1, 2);
	ulam.set(0, row);
	return ulam;
};

const getElementAt = (spiral, position) => {
	const row = spiral.get(position.y);
	if (!row) {
		return false;
	}
	const cell = row.get(position.x);
	return cell;
};

const setElementTo = (spiral, position, element) => {
	const row = spiral.get(position.y);
	if (!row) {
		const newRow = new Map();
		newRow.set(position.x, element);
		spiral.set(position.y, newRow);
	} else {
		row.set(position.x, element);
	}
};

const generateUlam = (
	maxElement, 
	currentPosition = { x: 1, y: 0 }, 
	previousElement = 2,
	direction = directions.right,
	ulamSpiral = getInitialUlam(),
) => new Promise((resolve, reject) => {
	if (previousElement === maxElement) {
		resolve(ulamSpiral);
	} else {
		let newDirection = direction;

		if (!getElementAt(ulamSpiral, moveByDirection(currentPosition, getNewDirection(direction)))) {
			newDirection = getNewDirection(direction);
		}

		const newPosition = moveByDirection(currentPosition, newDirection);
		const newElement = previousElement + 1;
		setElementTo(ulamSpiral, newPosition, newElement);

		process.nextTick(() => {
			generateUlam(
				maxElement, 
				newPosition,
				newElement,
				newDirection,
				ulamSpiral,
			).then(resolve);
		});
	}
});

const computeSteps = element => {
	let steps = 0;
	generateUlam(element).then(ulam => {
		ulam.forEach((row, rowIndex) => {
			row.forEach((cell, cellIndex) => {
				if (element === cell) {
					steps = Math.abs(rowIndex) + Math.abs(cellIndex);
				}
			})
		});

		console.log(`Steps for ${element} equals ${steps}`);
	});
};

const lineReader = require('readline').createInterface({
	input: require('fs').createReadStream('../input')
});

lineReader.on('line', function (line) {
	computeSteps(Number(line));
});
