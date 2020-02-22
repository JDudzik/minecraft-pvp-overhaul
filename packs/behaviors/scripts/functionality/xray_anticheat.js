const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import storage from '../helpers/storage';
import shopping from '../functionality/shopping';
import restrictions from '../functionality/restrictions';
import global_storage from '../helpers/global_storage';
import {numberWithCommas} from '../helpers/misc';
const cmd = commands.cmd;


const watchedBlocks = {
	'minecraft:tnt':         {alert: 10, severe: 30},
	'minecraft:dragon_egg':  {alert: 1,  severe: 10},
	'minecraft:diamond_ore': {alert: 5,  severe: 10},
}


function readAlerts(recipient) {
	const xrayAlerts = global_storage.getData('xray_alerts', {});
	Object.value(xrayAlerts).forEach((alert, index) => {
		const datetime = new Date(alert.timestamp).toLocaleString();
		commands.msgPlayer(recipient, `${index} - player: ${alert.player_name}, at: ${datetime}, block: ${alert.block_count}`);
		commands.msgPlayer(recipient, `    First  = X: ${alert.first.x}, Y: ${alert.first.Y}, Z: ${alert.first.Z}`);
		commands.msgPlayer(recipient, `    Middle = X: ${alert.middle.x}, Y: ${alert.middle.Y}, Z: ${alert.middle.Z}`);
		commands.msgPlayer(recipient, `    Laste  = X: ${alert.last.x}, Y: ${alert.last.Y}, Z: ${alert.last.Z}`);
	});


function clearAlert(alertIndex) {
	const xrayAlerts = global_storage.getData('xray_alerts', {});
	newData.splice(alertIndex, 1);

	commands.msgServerTech(`§9Deleted alert: ${alertIndex}`);
	const newData = global_storage.updateData('xray_alerts', xrayAlerts);
}


function determineCheating(entity, blockIdentifier) {
	const timeRange = 900000; // 15 minutes
	const dataTag = storage.getDataTag(entity);
	if (!dataTag.blockHistory) { return; }

	const lastEntryTime = dataTag.blockHistory[dataTag.blockHistory.length - 1].time;
	const importantEntries = dataTag.blockHistory.filter(entry => (entry.time >= lastEntryTime - timeRange) && (entry.block === blockIdentifier));

	if (importantEntries.length >= watchedBlocks[blockIdentifier].severe) {
		const playerName = entities.getPlayerName(entity);

		restrictions(playerName, `Automated cheat detection has been activated. An admin has been alerted to investigate`);
		saveAlert(playerName, importantEntries, 'severe');
		return;
	}

	if (importantEntries.length >= watchedBlocks[blockIdentifier].alert) {
		const playerName = entities.getPlayerName(entity);

		saveAlert(playerName, importantEntries, 'alert');
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
		block_count: dataTag.blockHistory.length;
		positions: {
			first:  {x: firstBlock.x, y: firstBlock.y, z: firstBlock.z},
			middle: {x: middBlock.x,  y: middBlock.y,  z: middBlock.z},
			last:   {x: lastBlock.x,  y: lastBlock.y,  z: lastBlock.z},
		}
	}

	commands.msgServerTech(`§dNew X-Ray Alert - §rPlayer: ${xrayAlerts.playerName}, Block: ${lastBlock.}, Destroyed: ${xrayAlerts.block_count}, Type: ${xrayAlerts.alert_type}`);

	global_storage.updateData('xray_alerts', xrayAlerts);
}




export default {
	determineCheating,
}
