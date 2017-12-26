
const createComponent = (id, ports) => ({ id, ports: ports.map(el => Number(el))});

class Connection {
	constructor(segments = [], segmentSum = 0, length = 1) {
		this.segments = segments;
		this.segmentSum = segmentSum;
		this.length = length;
	}
}

require('fs').readFile('input', (err, data) => {
	if (err) throw err;
	const lines = data.toString().split('\n');
	const components = [];
	const finishedConnections = [];

	lines.forEach((line, index) => components.push(createComponent(index, line.split('/'))));

	const generateConnections = (
		parentConnection = new Connection(),
		used = [],
		connector = 0,
	) => {
		const connectors = components.filter(component => {
			return used.indexOf(component.id) === -1 && component.ports.indexOf(connector) !== -1
		});

		// console.log(connectors, components);

		if (connectors.length === 0) {
			finishedConnections.push(parentConnection);
			return;
		}

		connectors.forEach((singleConnector, connectorIndex) => {
			const {ports} = singleConnector;
			const useConnector = ports[0] === connector ? ports[1] : ports[0];
			const newConnection = new Connection(
				[ ...parentConnection.segments, singleConnector.id ],
				parentConnection.segmentSum + singleConnector.ports.reduce((el, sum) => el + sum, 0),
				parentConnection.length + 1,
			);
			generateConnections(newConnection, [ ...used, singleConnector.id ], useConnector);
		});
	}

	generateConnections();


	const sums = [];
	let maxLength = 0;
	finishedConnections.forEach(el => {
		if (el.length > maxLength) {
			maxLength = el.length;
		}
	});
	finishedConnections.filter(el => el.length === maxLength).forEach(el => sums.push(el.segmentSum));

	console.log(components.reduce((sum, el) => sum + el.ports[0] + el.ports[1], 0))
	console.log(sums.reduce((a, b) => Math.max(a, b)));
});
