const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import storage from '../helpers/storage';
import shopping from '../functionality/shopping';
import bans from '../functionality/bans';
import global_storage from '../helpers/global_storage';
import {numberWithCommas} from '../helpers/misc';
const cmd = commands.cmd;


const watchedBlocks = {
	'minecraft:tnt':         {alert: 10, autoLock: 30},
	'minecraft:dragon_egg':  {alert: 1,  autoLock: 10},
	'minecraft:diamond_ore': {alert: 8,  autoLock: 15},
}


// function readAlerts() {
// 	...
// }


// function clearAlert() {
// 	...
// }


function determineCheating(entity, blockIdentifier) {
	const timeRange = 900000; // 15 minutes
	const playerName = entities.getPlayerName(entity);
	const dataTag = storage.getDataTag(entity);
	if (!dataTag.blockHistory) { return; }

	const lastEntryTime = dataTag.blockHistory[dataTag.blockHistory.length - 1].time;
	const importantEntries = dataTag.blockHistory.filter(entry => (entry.time >= lastEntryTime - timeRange) && (entry.block === blockIdentifier));

	if (importantEntries.length >= watchedBlocks[blockIdentifier].autoLock) {
		// ...
		return;
	}

	if (importantEntries.length >= watchedBlocks[blockIdentifier].alert) {
		// ...
		return;
	}
}


function saveAlert(playerName, importantEntries, alertType) {
	const xrayAlerts = global_storage.getData('xray_alerts', {});
	const currentTime = Date.now();

	const firstBlock = dataTag.blockHistory[0];
	const middBlock = dataTag.blockHistory[Math.round(dataTag.blockHistory.length / 2)];
	const lastBlock = dataTag.blockHistory[dataTag.blockHistory.length - 1];
	xrayAlerts[playerName] = {
		player_name: playerName,
		alert_type: alertType,
		timestamp: Date.now(),
		positions: {
			first:  {x: firstBlock.x, y: firstBlock.y, z: firstBlock.z},
			middle: {x: middBlock.x,  y: middBlock.y,  z: middBlock.z},
			last:   {x: lastBlock.x,  y: lastBlock.y,  z: lastBlock.z},
		}
	}

	global_storage.updateData('xray_alerts', xrayAlerts);
}




export default {
	determineCheating,
}
