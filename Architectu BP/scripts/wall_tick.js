import { isNonConnectingBlock } from "./exceptions.js";

const DIRECTIONS = ["north", "south", "east", "west"];

const OPPOSITE_DIRECTION = {
	north: "south",
	south: "north",
	east: "west",
	west: "east",
};

const VANILLA_STAIR_DIRECTIONS = {
	0: "east",
	1: "west",
	2: "south",
	3: "north",
};

function findState(states, name, fallback) {
	const key = Object.keys(states).find((key) => key === name || key.endsWith(`:${name}`));

	return key !== undefined ? states[key] : fallback;
}

function hasState(states, name) {
	return Object.keys(states).some((key) => key === name || key.endsWith(`:${name}`));
}

export function getWallStates(block) {
	const states = block.permutation.getAllStates();

	return {
		isWall: hasState(states, "wall_post_bit"),
		postBit: findState(states, "wall_post_bit", false),
		north: findState(states, "wall_connection_type_north", "none"),
		south: findState(states, "wall_connection_type_south", "none"),
		east: findState(states, "wall_connection_type_east", "none"),
		west: findState(states, "wall_connection_type_west", "none"),
	};
}

function getConnections(states) {
	return DIRECTIONS.filter((direction) => states[direction] !== "none");
}

function getStraightAxis(connections) {
	if (connections.length !== 2) return;

	if (connections.includes("north") && connections.includes("south")) {
		return "ns";
	}

	if (connections.includes("east") && connections.includes("west")) {
		return "ew";
	}
}

function getStairDirection(block) {
	if (!block.typeId.endsWith("_stairs")) return;

	const states = block.permutation.getAllStates();

	if (states["minecraft:cardinal_direction"] !== undefined) {
		return states["minecraft:cardinal_direction"];
	}

	if (states["weirdo_direction"] !== undefined) {
		return VANILLA_STAIR_DIRECTIONS[states["weirdo_direction"]];
	}
}

function canConnect(neighbor, direction) {
	if (!neighbor || neighbor.isAir) return false;

	const stairDirection = getStairDirection(neighbor);

	if (stairDirection !== undefined) {
		return stairDirection === OPPOSITE_DIRECTION[direction];
	}

	return !isNonConnectingBlock(neighbor.typeId);
}

function applyWallStates(block, states) {
	let permutation = block.permutation;

	for (const direction of DIRECTIONS) {
		permutation = permutation.withState(`archt:wall_connection_type_${direction}`, states[direction]);
	}

	permutation = permutation.withState("archt:wall_post_bit", states.postBit);

	block.setPermutation(permutation);
}

export function setConnections(block) {
	const states = getWallStates(block);

	const neighbors = {
		north: block.north(),
		south: block.south(),
		east: block.east(),
		west: block.west(),
	};

	const connections = [];

	for (const direction of DIRECTIONS) {
		if (canConnect(neighbors[direction], direction)) {
			states[direction] = "short";
			connections.push(direction);
		} else {
			states[direction] = "none";
		}
	}

	if (connections.length === 0) {
		applyWallStates(block, states);
		return;
	}

	const currentAxis = getStraightAxis(connections);

	states.postBit = currentAxis === undefined;

	const above = block.above();
	const aboveStates = getWallStates(above);

	if (aboveStates.isWall) {
		const aboveConnections = getConnections(aboveStates);
		const aboveAxis = getStraightAxis(aboveConnections);

		if (currentAxis !== undefined && currentAxis === aboveAxis) {
			for (const direction of connections) {
				states[direction] = "tall";
			}
		}

		if (currentAxis !== undefined && aboveStates.postBit) {
			states.postBit = true;
		}

		for (const direction of connections) {
			if (aboveConnections.includes(direction)) {
				states[direction] = "tall";
			}
		}
	} else {
		const hasSolidBlockAbove =
			!above.isAir && !isNonConnectingBlock(above.typeId) && !above.typeId.endsWith("_pane");

		if (hasSolidBlockAbove) {
			for (const direction of connections) {
				states[direction] = "tall";
			}
		}
	}

	applyWallStates(block, states);
}

export function updateWallConnections(block) {
	if (getWallStates(block).isWall) {
		setConnections(block);
	}

	const below = block.below();

	if (getWallStates(below).isWall) {
		setConnections(below);
	}
}
