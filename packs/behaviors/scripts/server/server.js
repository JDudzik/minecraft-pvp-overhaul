const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import delay from '../helpers/delay';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import storage from '../helpers/storage';
import item_functions from '../functionality/item_functions';
import shopping from '../functionality/shopping';
import bans from '../functionality/bans';
import tag_commands from '../functionality/tag_commands';
import global_storage from '../helpers/global_storage';
import xray_anticheat from '../functionality/xray_anticheat';
import {moneyAboveNegatives, numberWithCommas, emit, printBlockCoords} from '../helpers/misc';
const cmd = commands.cmd;


// Setup which events to listen for
system.initialize = function () {
	// Register any components you will attach to game objects
	// system.registerComponent(...)

	// Set up any events you wish to listen to
	system.listenForEvent('minecraft:entity_death', e => onEntityDeath(e));
	system.listenForEvent('minecraft:entity_use_item', e => onUsedItem(e));
	system.listenForEvent('minecraft:entity_created', e => onEntityCreated(e));
	system.listenForEvent('minecraft:piston_moved_block', e => onPistonMovedBlock(e));
	system.listenForEvent('minecraft:player_destroyed_block', e => onDestroyedBlock(e));
	system.listenForEvent('minecraft:block_interacted_with', e => onBlockInteractedWith(e));



	// Enable full logging, useful for seeing errors, you will probably want to disable this for
	// release versions of your scripts.
	// Generally speaking it's not recommended to use broadcastEvent in initialize, but for configuring logging it's fine.
	const scriptLoggerConfig = system.createEventData("minecraft:script_logger_config");
	scriptLoggerConfig.data.log_errors = true;
	scriptLoggerConfig.data.log_information = true;
	scriptLoggerConfig.data.log_warnings = true;
	system.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);
}


// per-tick updates
let currTick = 0;
system.update = function() {
	// Any logic that needs to happen every tick on the server.
	currTick++;

	if (currTick % 5 === 0) { // Every 0.25 seconds
		delay.checkActions(currTick);
	}

	if (currTick % 30 === 0) { // Every 1.5 seconds
		tag_commands.watchCommandEntity();
		global_storage.watchGlobalDataEntity();
	}
}



function onEntityCreated(params) {
	// const entity = params.data.entity;
	// if (entity.__identifier__ === 'minecraft:player') {
	// 	const playerName = entities.getPlayerName(entity);
	// 	bans.checkAndEnforceBan(playerName);
	// }
}


function onUsedItem(itemParams) {
	const itemName = itemParams.data.item_stack.__identifier__;

	// If a custom item function exists, see if we can fire it
	const itemFunction = item_functions[itemName];
	if (itemFunction) {
		const player = itemParams.data.entity;
		const playerName = entities.getPlayerName(player);

		if (itemFunction.disabled_in_safe_zone) {
			cmd(commands.execAs(playerName, `testfor @s[tag=!in_safe_zone]`), (params) => {
				if (params.success) {
					itemFunction.action(playerName, itemParams.data.item_stack, player);
				}
				if (!params.success) {
					commands.msgPlayer(playerName, `§cThat item cannot be used within a safe zone!`);
					commands.giveItem(playerName, itemName);
				}
			});
		} else {
			itemFunction.action(playerName, itemParams.data.item_stack, player);
		}
	}
}


const disabledBlocks = ["Trapped Chest"];
function onPistonMovedBlock(params) {
	const movedCoords = params.data.block_position;

	cmd(`testforblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} chest`, (params) => {
		let removeMovedBlock = false;

		if (!params.success) {
				const movedBlock = params.message.match(/\sis\s(.+?)\s\(expected:/)[1];
				if (disabledBlocks.includes(movedBlock)) {
					removeMovedBlock = true;
				}
		}

		if (removeMovedBlock || params.success) {
			cmd(`setblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} air 0`);
			commands.msgTarget(`@a`, `§aReminder: §fMoving chests with pistons is disabled`);
		}
	});

	// system.executeCommand(`/testforblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} chest`, (res) => {
	//
	// });
}


function onEntityDeath(params) {
		const deadEntity = params.data.entity;
		const deadEntityIsPlayer = deadEntity.__identifier__ === 'minecraft:player';
		const entityValue = entities.getEntityValue(deadEntity);
		const killer = params.data.killer;

		// A player has killed a mob with a money value
		if (!deadEntityIsPlayer && entityValue && killer && killer.__identifier__ === 'minecraft:player') {
				const killerName = entities.getPlayerName(killer);
				commands.msgPlayer(killerName, `§a+§e${entityValue} Coins`);
				commands.addMoney(killerName, entityValue);
		}

		// A player has killed another player
		if (deadEntityIsPlayer && killer && killer.__identifier__ === 'minecraft:player') {
				const deadPlayerName = entities.getPlayerName(deadEntity);
				const killerName = entities.getPlayerName(killer);

				let penaltyValue = 5000;
				let penaltyMessage = `§cYou have been killed by §l${killerName}§r§c! §fYou have lost §e${numberWithCommas(penaltyValue)} Coins`;
				let rewardValue = 5000;
				let rewardMessage = `§aYou have killed §l${deadPlayerName}§r§a! §rYou have gained §e${numberWithCommas(rewardValue)} Coins`;
				commands.testMoney(deadPlayerName, 5000, '*', (params) => {
					// if (params.success) {
				  //   No need to do anything, just use the defaults if the value check was a success!
					// }
					if (!params.success) {
						const deadPlayerMoney = params.message.match(/Score\s(.+?)\sis\sNOT\sin\srange/)[1];
						log(deadPlayerMoney);

						if (deadPlayerMoney < 5000) {
							penaltyValue = 1000;
							penaltyMessage = `§cYou have been killed by §l${killerName}§r§c! §fYou have lost §e${numberWithCommas(penaltyValue)} Coins`;
							rewardValue = 1000;
							rewardMessage = `§aYou have killed an impoverished player! §rYou have only gained §e${numberWithCommas(rewardValue)} Coins`;
						}
						if (deadPlayerMoney < 1000) {
							penaltyValue = deadPlayerMoney;
							penaltyMessage = `§cYou have been killed by §l${killerName}§r§c! §fYou have lost §e${numberWithCommas(penaltyValue)} Coins`;
							rewardValue = deadPlayerMoney >= 100 ? deadPlayerMoney : 100;
							rewardMessage = `§aYou have killed an impoverished player! §rYou have only gained §e${numberWithCommas(rewardValue)} Coins`;
						}
					}

					delay.create(50, () => {
						commands.msgPlayer(deadPlayerName, penaltyMessage);
						commands.remMoney(deadPlayerName, penaltyValue);
						moneyAboveNegatives(deadPlayerName);
					});

					commands.msgPlayer(killerName, rewardMessage);
					commands.addMoney(killerName, rewardValue);
				});
		}

		// A player has died from anything but another player
		if (deadEntityIsPlayer) {
			  if (!killer || killer.__identifier__ !== 'minecraft:player') {
						const deadPlayerName = entities.getPlayerName(deadEntity);
						const penaltyValue = 1000;

						delay.create(50, () => {
							commands.msgPlayer(deadPlayerName, `§cYou have died! §fYou have lost §e${numberWithCommas(penaltyValue)} Coins`)
							commands.remMoney(deadPlayerName, penaltyValue);
							moneyAboveNegatives(deadPlayerName);
						})
				}
		}
}


function onBlockInteractedWith(params) {
	const printedBlockCoords = printBlockCoords(params);
	if (printedBlockCoords) { return false; }

	shopping.validateAndUseKiosk(params);
}


const blocksToRecord = ['minecraft:tnt', 'minecraft:diamond_ore', 'minecraft:dragon_egg'];
function onDestroyedBlock(params) {
	const entity = params.data.player;
	const position = params.data.block_position;
	const blockIdentifier = params.data.block_identifier;

	if (blocksToRecord.includes(blockIdentifier)) {
		addToBlockHistory(entity, position, blockIdentifier, 'destroyed');

		xray_anticheat.determineCheating(entity, blockIdentifier);
	}
}
function addToBlockHistory(entity, position, blockIdentifier, action) {
	const playerName = entities.getPlayerName(entity);
  const dataTag = storage.getDataTag(entity);
  if (!dataTag.blockHistory) { dataTag.blockHistory = []; }

	dataTag.blockHistory.push({
		time: Date.now(),
		action: action,
		x: position.x,
		y: position.y,
		z: position.z,
		block: blockIdentifier,
	});

  storage.updateDataTag(entity, dataTag);
}
