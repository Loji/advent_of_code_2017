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

const getInitialSpiral = () => {
	const Spiral = new Map();
	const row = new Map();
	row.set(0, 1);
	row.set(1, 1);
	Spiral.set(0, row);
	return Spiral;
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

const getPositionsToCheck = direction => ({
	up: [
		{ x: -1, y: -1 },
		{ x: -1, y: 0 },
		{ x: -1, y: 1 },
		{ x: 0, y: -1 },
	],
	down: [
		{ x: 1, y: -1 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: 1 },
	],
	left: [
		{ x: -1, y: -1 },
		{ x: 0, y: -1 },
		{ x: 1, y: -1 },
		{ x: 1, y: 0 },
	],
	right: [
		{ x: -1, y: 1 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: -1, y: 0 },
	],
}[direction]);

const sumAdjescent = (spiral, position, direction) => {
	const positionsToCheck = getPositionsToCheck(direction);
	return positionsToCheck.reduce((sum, pos) => {
		const element = getElementAt(spiral, {
			x: position.x + pos.x,
			y: position.y + pos.y,
		});
		return (element || 0) + sum;
	}, 0);
}

const generateSpiral = (
	maxElement, 
	currentPosition = { x: 1, y: 0 }, 
	previousElement = 1,
	direction = directions.right,
	spiral = getInitialSpiral(),
) => new Promise((resolve, reject) => {
	if (previousElement >= maxElement) {
		resolve(spiral);
	} else {
		let newDirection = direction;
		
		if (!getElementAt(spiral, moveByDirection(currentPosition, getNewDirection(direction)))) {
			newDirection = getNewDirection(direction);
		}
		
		const newPosition = moveByDirection(currentPosition, newDirection);
		const newElement = sumAdjescent(spiral, newPosition, newDirection);
		setElementTo(spiral, newPosition, newElement);

		process.nextTick(() => {
			generateSpiral(
				maxElement, 
				newPosition,
				newElement,
				newDirection,
				spiral,
			).then(resolve);
		});
	}
});

const computeSteps = element => {
	generateSpiral(element).then(Spiral => {
		try { 
			Spiral.forEach((row, rowIndex) => {
				row.forEach((cell, cellIndex) => {
					if (element < cell) {
						throw cell;
					}
				})
			});
		} catch (firstLargest) {
			console.log(`First larger than ${element} is ${firstLargest}`);
		}
	});
};

const lineReader = require('readline').createInterface({
	input: require('fs').createReadStream('../input')
});

lineReader.on('line', function (line) {
	computeSteps(Number(line));
});
