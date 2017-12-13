const getParent = towers => {
	const existingNames = {};
  const withChildren = towers.filter(tower => tower.indexOf('->') !== -1);
	withChildren.forEach(tower => {
		tower.split('-> ')[1].split(', ').forEach(childTower => existingNames[childTower] = true)
	});
	return withChildren.find(tower => existingNames[tower.split(' ')[0]] === undefined);
};

const createTree = (currentTower, towers, level = 0) => {
	const name = currentTower.split(' ')[0];
	const weigth = Number(currentTower.split(' ')[1].slice(1, -1));

	const hasChildren = currentTower.indexOf('->') !== -1;
	const children = [];
	if (hasChildren) {
		const childNames = currentTower.split('-> ')[1].split(', ');
		childNames.forEach(childName => {
			const childTower = towers.find(tower => tower.startsWith(childName));
			children.push(createTree(childTower, towers, level + 1));
		});
	}

	return {
		name,
		weigth,
		children,
		level,
	}
}

const computeWeights = (towerTree) => {
	let sumOfWeigths = towerTree.weigth;

	if (towerTree.children.length > 0) {
		towerTree.children = towerTree.children.map(el => {
			sumOfWeigths = sumOfWeigths + computeWeights(el);
			return el;
		});
	}
	towerTree.sumOfWeigths = sumOfWeigths;
	return sumOfWeigths;
}

const findBadWeigth = (towerTree, weigth = null) => {
	const weigths = {};
	let weigthSum = 0;

	towerTree.forEach(child => {
		if(weigths[child.sumOfWeigths] === undefined) {
			weigths[child.sumOfWeigths] = 1;
		} else {
			weigths[child.sumOfWeigths] += 1;
		}

		weigthSum = weigthSum + child.sumOfWeigths;
		findBadWeigth(child.children, child.sumOfWeigths);
	});

	if (Object.getOwnPropertyNames(weigths).length > 1) {
		console.log(towerTree);
		throw 'that is very very lazy way to solve this, I know';
	}
};

require('fs').readFile('input', function(err, data) {
	if (err) throw err;
	const lines = data.toString().split('\n');
	const parent = getParent(lines);

	const towerTree = createTree(parent, lines);
	computeWeights(towerTree);
	findBadWeigth(towerTree.children);

	console.log('Parent tower', parent);
});