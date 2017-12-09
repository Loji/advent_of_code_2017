const computeBanksCycle = banksList => {
	let tempBanks = [...banksList];
	states = {};
	const size = banksList.length;
	let cycleCount = 0;
	let hasBeenSeen = {};

	do {
		const maxIndex = getMaxIndex(tempBanks);
		let toSplit = Math.floor(tempBanks[maxIndex] / (size - 1));

		if (toSplit > 0) {
			tempBanks = tempBanks.map((bank, index) => {
				if (index === maxIndex) {
					return Math.floor(bank - (toSplit * (size - 1)));
				}
				return bank + toSplit
			});
		} else {
			toSplit = tempBanks[maxIndex];
			tempBanks[maxIndex] = 0;
			let position = maxIndex + 1;

			while (toSplit > 0) {
				if (position >= size) {
					position = 0;
				}
				tempBanks[position] = tempBanks[position] + 1;
				position++;
				toSplit--;
			}
		}

		cycleCount++;
		hasBeenSeen = stateNotSeen(states, tempBanks, cycleCount);
	} while(!hasBeenSeen.seen)

	return { cycleCount, cyclesBetween: hasBeenSeen.cycles };
}

const getMaxIndex = banks => banks.indexOf(Math.max(...banks));

const stateNotSeen = (states, currentState, cycleCount) => {
	const previousCycle = states[JSON.stringify(currentState)];
	if (previousCycle === undefined) {
		states[JSON.stringify(currentState)] = cycleCount;
		return { seen: false };
	} else {
		return { seen: true, cycles: cycleCount - previousCycle };
	}
}

const sum = banks => banks.reduce((prev, curr) => prev + curr, 0);

const lineReader = require('readline').createInterface({
	input: require('fs').createReadStream('./input'),
});

lineReader.on('line', function (line) {
	console.log(computeBanksCycle(line.split('\t').map(el => +el)));
});