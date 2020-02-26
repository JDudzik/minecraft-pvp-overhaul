const system = server.registerSystem(0, 0);
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import log from '../helpers/log';



export const numberWithCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")


export function moneyAboveNegatives(playerName) {
	commands.testMoney(playerName, '*', '-1', (params) => {
		if (params.success) {
			commands.setMoney(playerName, 0);
		}
	});
}


export const emit = function(identifier, properties) {
	const data = system.createEventData(identifier);
	data.data = Object.assign({}, data.data, properties);

	return system.broadcastEvent(identifier, data);
}


export function printBlockCoords(params) {
	const player = params.data.player;
	const playerTags = entities.getComponent(player, 'minecraft:tag').data;

	if (playerTags.includes('debug_block_coords')) {
		const playerName = entities.getPlayerName(player);
		const coords = params.data.block_position;
		commands.msgPlayer(playerName, `§dXYZ: §6${coords.x} ${coords.y} ${coords.z}`);
		return true;
	}

	return false;
}
