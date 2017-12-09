const getParent = towers => {
	const existingNames = {};
  const withChildren = towers.filter(tower => tower.indexOf('->') !== -1);
	withChildren.forEach(tower => {
		tower.split('-> ')[1].split(', ').forEach(childTower => existingNames[childTower] = true)
	});
	return withChildren.find(tower => existingNames[tower.split(' ')[0]] === undefined);
}

require('fs').readFile('input', function(err, data) {
	if (err) throw err;
	const lines = data.toString().split('\n');
	const parent = getParent(lines);
	console.log('Parent tower', parent)
});