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


const timeRange = 1800000; // 30 minutes
const watchedBlocks = {
	'minecraft:diamond_ore': {alert: 10,  severe: 22},
}


function readAlerts(recipient) {
	const xrayAlerts = global_storage.getData('xray_alerts', {});
	const alertValues = Object.values(xrayAlerts);
	const recipientTarget = `@a[name=${recipient}]` || `@a[tag=server_technician]`;

	if (!alertValues.length) {
		commands.msgTarget(recipientTarget, `§eThere are no alerts at this time`);
	}

	alertValues.forEach((alert, index) => {
		const datetime = new Date(alert.timestamp).toLocaleString();
		const {first, middle, last} = alert.positions;
		commands.msgTarget(recipientTarget, `§e${index}§r - §dplayer: §r§6${alert.player_name}§r, §dat: §r§6${datetime}§r, §dblock: §r§6${alert.block_identifier}§r, §dcount: §r§6${alert.block_count}§r`);
		commands.msgTarget(recipientTarget, `§    First      = §dXYZ: §r§6${first.x} ${first.y} ${first.z}`);
		commands.msgTarget(recipientTarget, `§    Middle = §dXYZ: §r§6${middle.x} ${middle.y} ${middle.z}`);
		commands.msgTarget(recipientTarget, `§    Last      = §dXYZ: §r§6${last.x} ${last.y} ${last.z}`);
	});
}


function clearAlert(alertIndex) {
	const xrayAlerts = global_storage.getData('xray_alerts', {});

	const selectedAlert = Object.values(xrayAlerts)[alertIndex];

	if (selectedAlert) {
		const alertIdentifier = selectedAlert.alert_identifier;
		xrayAlerts[alertIdentifier] = undefined;
		commands.msgServerTech(`§9Deleted alert: ${alertIndex}.  ${alertIdentifier}`);
		global_storage.updateData('xray_alerts', xrayAlerts);
		return;
	}
	else {
		commands.msgServerTech(`§cAlert "${alertIndex}" does not exist!`);
	}

}


function determineCheating(entity, blockIdentifier) {
	const dataTag = storage.getDataTag(entity);
	if (!dataTag.blockHistory) { return; }

	const lastEntryTime = dataTag.blockHistory[dataTag.blockHistory.length - 1].time;
	const importantEntries = dataTag.blockHistory.filter(entry => (entry.time >= lastEntryTime - timeRange) && (entry.block === blockIdentifier));

	if (importantEntries.length >= watchedBlocks[blockIdentifier].severe) {
		const playerName = entities.getPlayerName(entity);

		restrictions.lock(playerName, `Automated cheat detection has been activated. An admin has been alerted to investigate`);
		saveAlert(playerName, importantEntries, blockIdentifier, 'severe');
		return;
	}

	if (importantEntries.length >= watchedBlocks[blockIdentifier].alert) {
		const playerName = entities.getPlayerName(entity);

		saveAlert(playerName, importantEntries, blockIdentifier, 'alert');
		return;
	}
}


function saveAlert(playerName, importantEntries, blockIdentifier, alertType) {
	const xrayAlerts = global_storage.getData('xray_alerts', {});
	const alertIdentifier = `${playerName}_${blockIdentifier}`;
	const thisAlert = xrayAlerts[alertIdentifier];

	// If the existing report is bigger, don't update it
	if (thisAlert && thisAlert.block_count >= importantEntries.length) {
		return;
	}

	const firstBlock = importantEntries[0];
	const middBlock = importantEntries[Math.floor(importantEntries.length / 2)];
	const lastBlock = importantEntries[importantEntries.length - 1];
	thisAlert = {
		alert_identifier: alertIdentifier,
		player_name: playerName,
		alert_type: alertType,
		timestamp: Date.now(),
		block_count: importantEntries.length,
		block_identifier: blockIdentifier,
		positions: {
			first:  {x: firstBlock.x, y: firstBlock.y, z: firstBlock.z},
			middle: {x: middBlock.x,  y: middBlock.y,  z: middBlock.z},
			last:   {x: lastBlock.x,  y: lastBlock.y,  z: lastBlock.z},
		}
	}

	commands.msgServerTech(`§dNew X-Ray Alert - §rPlayer: §r§6${thisAlert.player_name}§r, Count: §r§6${thisPlayersAlert.block_count}§r, Type: §r§6${thisPlayersAlert.alert_type}`);
	global_storage.updateData('xray_alerts', xrayAlerts);
}




export default {
	determineCheating,
	readAlerts,
	clearAlert,
}
