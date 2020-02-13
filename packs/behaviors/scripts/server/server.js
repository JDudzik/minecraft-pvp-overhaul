const system = server.registerSystem(0, 0);
import emit from '../helpers/emit';
import log from '../helpers/log';
import delay from '../helpers/delay';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import item_functions from '../helpers/item_functions';

const cmd = commands.cmd;


// Setup which events to listen for
system.initialize = function () {
	// Register any components you will attach to game objects
	// system.registerComponent(...)

	// Set up any events you wish to listen to
	system.listenForEvent('minecraft:entity_death', e => onEntityDeath(e));
	system.listenForEvent('minecraft:piston_moved_block', e => onPistonMovedBlock(e));
	system.listenForEvent('minecraft:entity_use_item', e => onUsedItem(e));

	// Enable full logging, useful for seeing errors, you will probably want to disable this for
	// release v/ersions of your scripts.
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

	// if (currTick % 20 === 0) { // Every 1 second
	// 	// checkRevivedPlayers();
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


function onPistonMovedBlock(params) {
	const movedCoords = params.data.block_position;

	cmd(`testforblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} chest`, (params) => {
		if (params.success) {
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
				commands.msgPlayer(killerName, `§aYou have killed §l${deadPlayerName}§r§a! §rYou have gained §e$5,000 Coins`);
				commands.addMoney(killerName, entityValue);

				delay.create(50, () => {
					commands.msgPlayer(deadPlayerName, `§cYou have been killed by §l${killerName}§r§c! §fYou have lost §e7,500 Coins`);
					commands.remMoney(deadPlayerName, entityValue*1.5);
					moneyAboveNegatives(deadPlayerName);
				});
		}

		// A player has died from anything but another player
		if (deadEntityIsPlayer) {
			  if (!killer || killer.__identifier__ !== 'minecraft:player') {
						const deadPlayerName = entities.getPlayerName(deadEntity);

						delay.create(50, () => {
							commands.msgPlayer(deadPlayerName, "§cYou have died! §fYou have lost §e1,000 Coins")
							commands.remMoney(deadPlayerName, entityValue/5);
							commands.remMoney(deadPlayerName, entityValue/5);
							commands.remMoney(deadPlayerName, entityValue/5);
							commands.remMoney(deadPlayerName, entityValue/5);
							moneyAboveNegatives(deadPlayerName);
						})
				}
		}
}


function moneyAboveNegatives(playerName) {
	commands.testMoney(playerName, '*', '-1', (params) => {
		if (params.success) {
			commands.setMoney(playerName, 0);
		}
	});
}
