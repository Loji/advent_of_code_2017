
const connections = {};

const addConnection = (left, right) => {
	if (connections[left] === undefined) {
		connections[left] = [right];
	} else {
		if (connections[left].indexOf(right) === -1) {
			connections[left].push(right);
		}
	}
	if (connections[right] === undefined) {
		connections[right] = [left];
	} else {
		if (connections[right].indexOf(left) === -1) {
			connections[right].push(left);
		}
	}
}

const findConnectionTo = (num, alreadyFound = []) => {
	if (alreadyFound.indexOf(num) === -1) {
		alreadyFound.push(num);
	}

	let newConnections = [];

	connections[num].forEach(el => {
		if (alreadyFound.indexOf(el) === -1) {
			newConnections = [ ...newConnections, ...findConnectionTo(el, alreadyFound) ];
		}
	});

	return [...alreadyFound, ...newConnections];
}

const findUnique = array => array.filter((val, index, arr) => arr.indexOf(val) === index);

require('fs').readFile('input', function(err, data) {
	if (err) throw err;
	const lines = data.toString().split('\n');
	lines.forEach(line => {
		const left = line.split(' <-> ')[0];
		const connectedTo = line.split(' <-> ')[1].split(', ');
		connectedTo.forEach(right => addConnection(left, right))
	});

	const group0 = findUnique(findConnectionTo('0'));
	console.log(`Group with 0 contains ${group0.length} elements`);

	let leftGroups = Object.keys(connections).filter(val => group0.indexOf(val) === -1);
	let groups = 1;
	while (leftGroups.length > 0) {
		const nextgroup = findConnectionTo(leftGroups[0]);
		leftGroups = findUnique(leftGroups.filter(val => nextgroup.indexOf(val) === -1));
		groups++;
	}
	console.log(`There are ${groups} groups`);
});