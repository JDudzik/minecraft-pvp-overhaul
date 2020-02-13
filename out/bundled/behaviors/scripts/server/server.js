(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _log = _interopRequireDefault(require("./log"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const system = server.registerSystem(0, 0);

// Money
const setMoney = (playerName, amount, callback) => cmd(`scoreboard players set @a[name="${playerName}"] money ${amount}`, callback);
const addMoney = (playerName, amount, callback) => cmd(`scoreboard players add @a[name="${playerName}"] money ${amount}`, callback);
const remMoney = (playerName, amount, callback) => cmd(`scoreboard players remove @a[name="${playerName}"] money ${amount}`, callback);
const testMoney = (playerName, min, max, callback) => cmd(`scoreboard players test @a[name="${playerName}"] money ${min} ${max}`, callback);

// Items
const giveItem = (playerName, item, amount, id, callback) => cmd(`give @a[name="${playerName}"] ${item} ${amount || 1} ${id || 0}`, callback);

// Messaging
const msgPlayer = (playerName, message, callback) => msgTarget(`@a[name="${playerName}"]`, message, callback);
const msgTarget = (target, message, callback) => cmd(`tellraw ${target} {"rawtext":[{"translate":"${message}"}]}`, callback);

// Teleporting
const tpAs = (target, x, y, z, checkBlocks, callback) => cmd(execAs(target, `tp @s ${x} ${y} ${z} ${checkBlocks || false}`), callback);

// Misc
const nearbyPlayers = (playerName, range, maxCount, callback) => cmd(execAs(playerName, `testfor @a[rm=2,r=${range},c=${maxCount}]`), callback);
const execAs = (target, command) => `execute @a[name="${target}"] ~~~ ${command}`;
const cmd = (command, callback) => system.executeCommand(`/${command}`, params => cmdCallback(params, callback));


const cmdCallback = (params, callback) => callback ?
callback({ success: !params.data.statusCode, object: params }) :
() => null;var _default =



{
  setMoney,
  addMoney,
  remMoney,
  testMoney,
  giveItem,
  msgPlayer,
  msgTarget,
  tpAs,
  execAs,
  cmd,
  nearbyPlayers };exports.default = _default;

},{"./log":6}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;const system = server.registerSystem(0, 0);
// import log from './log';

let currTick = 0;
let actions = [];

function create(delayLength, callback) {
  actions.push({
    start: currTick,
    delay: delayLength,
    callback: callback,
    completed: false });

}

function checkActions(newCurrTick) {
  currTick = newCurrTick;
  let firedAtLeastOne = false;

  actions.forEach((action, index) => {
    const ticksPassed = currTick - action.start;
    if (ticksPassed >= action.delay && !action.completed) {
      action.callback();
      action.completed = true;
      firedAtLeastOne = true;
    }
  });

  if (firedAtLeastOne) {
    actions = actions.filter(action => !action.completed);
  }
}var _default =


{ create, checkActions };exports.default = _default;

},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;const system = server.registerSystem(0, 0);


/**
                                                                                                                                                * Simplifies broadcasting events
                                                                                                                                                * @param {string} identifier   The event identifier in the format 'namespace:name'
                                                                                                                                                * @param {Object} properties   The event properties
                                                                                                                                                * @returns {(boolean|null)}    Returns 'true' if event broadcast was successful or 'null' when event broadcast failed
                                                                                                                                                */

const emit = function (identifier, properties) {
  const data = system.createEventData(identifier);
  data.data = Object.assign({}, data.data, properties);

  return system.broadcastEvent(identifier, data);
};var _default =


emit;exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _uidTranslations = _interopRequireDefault(require("../helpers/uidTranslations"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const system = server.registerSystem(0, 0);


const getPlayerName = playerData => system.getComponent(playerData, "minecraft:nameable").data.name;
const getEntityTitle = entity => _uidTranslations.default.uidToName[entity.__identifier__] || undefined;
const getEntityValue = entity => _uidTranslations.default.uidToValue[entity.__identifier__] || 0;var _default =


{
  getPlayerName,
  getEntityTitle,
  getEntityValue };exports.default = _default;

},{"../helpers/uidTranslations":7}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _log = _interopRequireDefault(require("./log"));
var _delay = _interopRequireDefault(require("./delay"));
var _commands = _interopRequireDefault(require("./commands"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const system = server.registerSystem(0, 0);
const cmd = _commands.default.cmd;

const tagsToIgnore = `tag=!in_safe_zone,tag=!no_pvp_player`;

function arrow_rain(name, stack, entity) {
  cmd(_commands.default.execAs(name, `testfor @a[rm=2,r=75,c=5,${tagsToIgnore}]`), params => {
    if (params.success) {
      for (let i = 0; i < 20; i++) {
        _delay.default.create(i * 6, () => arrowVolley(name));
      }
    }

    if (!params.success) {
      _commands.default.giveItem(name, 'pvpcontrols:arrow_rain');
    }
  });
}
function arrowVolley(playerName) {
  const minRadius = -2;
  const maxRadius = 2;
  const baseHeight = 20;

  for (let i = 0; i < 3; i++) {
    const randX = Math.random() * (maxRadius - minRadius) + minRadius;
    const randY = Math.random() * (maxRadius - minRadius) + baseHeight;
    const randZ = Math.random() * (maxRadius - minRadius) + minRadius;
    cmd(`execute @a[name="${playerName}"] ~~~ execute @e[type=armor_stand,rm=2,r=75,c=5,${tagsToIgnore}] ~~~ summon arrow ~${randX} ~${randY} ~${randZ}`);
  }
}


function blink(name, stack, entity, dist = 20) {
  _commands.default.tpAs(name, '^', '^1', `^${dist}`, true, params => {
    const newDist = dist - 10;
    if (!params.success && newDist > 0) {
      blink(name, undefined, undefined, newDist);
    }
    if (!params.success && newDist <= 0) {
      _commands.default.giveItem(name, 'pvpcontrols:blink');
    }
  });
}


function coin_tablet(name, stack, entity) {
  _commands.default.addMoney(name, 500);
}


function balloonify(name, stack, entity) {
  cmd(_commands.default.execAs(name, `effect @a[rm=2,r=1000,${tagsToIgnore}] levitation 20 0`), params => {
    if (!params.success) {
      _commands.default.giveItem(name, 'pvpcontrols:balloonify');
      _commands.default.msgPlayer(name, `§cThere are no players in range!`);
    }
  });
}


function locator(name, stack, entity) {
  cmd(_commands.default.execAs(name, `tp ~~~ facing @p[rm=10,c=1,${tagsToIgnore}]`), params => {
    if (!params.success) {
      _commands.default.giveItem(name, 'pvpcontrols:locator');
      _commands.default.msgPlayer(name, `§cThere are no players who are locatable!`);
    }
  });
}


function zombie_squad(name, stack, entity) {(0, _log.default)(name, stack, entity);}var _default =



{
  'pvpcontrols:arrow_rain': {
    action: arrow_rain,
    disabled_in_safe_zone: true },

  'pvpcontrols:blink': {
    action: blink,
    disabled_in_safe_zone: true },

  'pvpcontrols:coin_tablet': {
    action: coin_tablet,
    disabled_in_safe_zone: false },

  'pvpcontrols:balloonify': {
    action: balloonify,
    disabled_in_safe_zone: true },

  'pvpcontrols:locator': {
    action: locator,
    disabled_in_safe_zone: true },

  'pvpcontrols:zombie_squad': {
    action: zombie_squad,
    disabled_in_safe_zone: true } };exports.default = _default;

},{"./commands":1,"./delay":2,"./log":6}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _emit = _interopRequireDefault(require("./emit"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const system = server.registerSystem(0, 0);


/**
                                                                                                                                                                                               * Simplifies logging
                                                                                                                                                                                               * @param {...*} items   The variables to log
                                                                                                                                                                                               */

const log = function (...items) {
  const toString = item => {
    switch (Object.prototype.toString.call(item)) {
      case '[object Undefined]':
        return 'undefined';
      case '[object Null]':
        return 'null';
      case '[object String]':
        return `"${item}"`;
      case '[object Array]':
        const array = item.map(toString);
        return `[${array.join(', ')}]`;
      case '[object Object]':
        const object = Object.keys(item).map(key => `${key}: ${toString(item[key])}`);
        return `{${object.join(', ')}}`;
      case '[object Function]':
        return item.toString();
      default:
        return item;}

  };

  (0, _emit.default)('minecraft:display_chat_event', { message: items.map(toString).join(' ') });
};var _default =


log;exports.default = _default;

},{"./emit":3}],7:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;const uidToName = {
  // Neutrals
  'minecraft:pig': 'pig',
  'minecraft:sheep': 'sheep',
  'minecraft:llama': 'llama',
  'minecraft:chicken': 'llama',
  'minecraft:fox': 'fox',
  'minecraft:cow': 'cow',
  'minecraft:horse': 'horse',

  // Hostiles
  'minecraft:zombie': 'zombie',
  'minecraft:zombie_village_v2': 'zombie villager',
  'minecraft:husk': 'husk',
  'minecraft:drowned': 'drowned',
  'minecraft:skeleton': 'skeleton',
  'minecraft:creeper': 'creeper',
  'minecraft:spider': 'spider',
  'minecraft:cave_spider': 'cave spider',
  'minecraft:wither_skeleton': 'wither skeleton',
  'minecraft:slime': 'slime',
  'minecraft:zombie_pigman': 'zombie pigman',
  'minecraft:ghast': 'ghast',
  'minecraft:blaze': 'blaze',
  'minecraft:enderman': 'enderman',
  'minecraft:phantom': 'phantom',
  'minecraft:magma_cube': 'magma cube' };


const uidToValue = {
  'minecraft:zombie': 30,
  'minecraft:zombie_village_v2': 30,
  'minecraft:husk': 30,
  'minecraft:drowned': 30,
  'minecraft:skeleton': 60,
  'minecraft:creeper': 60,
  'minecraft:spider': 60,
  'minecraft:cave_spider': 50,
  'minecraft:slime': 20,
  'minecraft:wither_skeleton': 125,
  'minecraft:zombie_pigman': 100,
  'minecraft:ghast': 150,
  'minecraft:blaze': 125,
  'minecraft:enderman': 100,
  'minecraft:phantom': 125,
  'minecraft:magma_cube': 60,
  'minecraft:player': 5000 };var _default =



{ uidToName, uidToValue };exports.default = _default;

},{}],8:[function(require,module,exports){
"use strict";
var _emit = _interopRequireDefault(require("../helpers/emit"));
var _log = _interopRequireDefault(require("../helpers/log"));
var _delay = _interopRequireDefault(require("../helpers/delay"));
var _commands = _interopRequireDefault(require("../helpers/commands"));
var _entities = _interopRequireDefault(require("../helpers/entities"));
var _item_functions = _interopRequireDefault(require("../helpers/item_functions"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const system = server.registerSystem(0, 0);

const cmd = _commands.default.cmd;


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
};


// per-tick updates
let currTick = 0;
system.update = function () {
  // Any logic that needs to happen every tick on the server.
  currTick++;

  if (currTick % 5 === 0) {// Every 0.25 seconds
    _delay.default.checkActions(currTick);
  }

  // if (currTick % 20 === 0) { // Every 1 second
  // 	// checkRevivedPlayers();
  // }

};


function onUsedItem(itemParams) {
  const itemName = itemParams.data.item_stack.__identifier__;

  // If a custom item function exists, see if we can fire it
  const itemFunction = _item_functions.default[itemName];
  if (itemFunction) {
    const player = itemParams.data.entity;
    const playerName = _entities.default.getPlayerName(player);

    if (itemFunction.disabled_in_safe_zone) {
      cmd(_commands.default.execAs(playerName, `testfor @s[tag=!in_safe_zone]`), params => {
        if (params.success) {
          itemFunction.action(playerName, itemParams.data.item_stack, player);
        }
        if (!params.success) {
          _commands.default.msgPlayer(playerName, `§cThat item cannot be used within a safe zone!`);
          _commands.default.giveItem(playerName, itemName);
        }
      });
    } else {
      itemFunction.action(playerName, itemParams.data.item_stack, player);
    }
  }
}


function onPistonMovedBlock(params) {
  const movedCoords = params.data.block_position;

  cmd(`testforblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} chest`, params => {
    if (params.success) {
      cmd(`setblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} air 0`);
      _commands.default.msgTarget(`@a`, `§aReminder: §fMoving chests with pistons is disabled`);
    }
  });

  // system.executeCommand(`/testforblock ${movedCoords.x} ${movedCoords.y} ${movedCoords.z} chest`, (res) => {
  //
  // });
}


function onEntityDeath(params) {
  const deadEntity = params.data.entity;
  const deadEntityIsPlayer = deadEntity.__identifier__ === 'minecraft:player';
  const entityValue = _entities.default.getEntityValue(deadEntity);
  const killer = params.data.killer;

  // A player has killed a mob with a money value
  if (!deadEntityIsPlayer && entityValue && killer && killer.__identifier__ === 'minecraft:player') {
    const killerName = _entities.default.getPlayerName(killer);
    _commands.default.msgPlayer(killerName, `§a+§e${entityValue} Coins`);
    _commands.default.addMoney(killerName, entityValue);
  }

  // A player has killed another player
  if (deadEntityIsPlayer && killer && killer.__identifier__ === 'minecraft:player') {
    const deadPlayerName = _entities.default.getPlayerName(deadEntity);
    const killerName = _entities.default.getPlayerName(killer);
    _commands.default.msgPlayer(killerName, `§aYou have killed §l${deadPlayerName}§r§a! §rYou have gained §e$5,000 Coins`);
    _commands.default.addMoney(killerName, entityValue);

    _delay.default.create(50, () => {
      _commands.default.msgPlayer(deadPlayerName, `§cYou have been killed by §l${killerName}§r§c! §fYou have lost §e7,500 Coins`);
      _commands.default.remMoney(deadPlayerName, entityValue * 1.5);
      moneyAboveNegatives(deadPlayerName);
    });
  }

  // A player has died from anything but another player
  if (deadEntityIsPlayer) {
    if (!killer || killer.__identifier__ !== 'minecraft:player') {
      const deadPlayerName = _entities.default.getPlayerName(deadEntity);

      _delay.default.create(50, () => {
        _commands.default.msgPlayer(deadPlayerName, "§cYou have died! §fYou have lost §e1,000 Coins");
        _commands.default.remMoney(deadPlayerName, entityValue / 5);
        _commands.default.remMoney(deadPlayerName, entityValue / 5);
        _commands.default.remMoney(deadPlayerName, entityValue / 5);
        _commands.default.remMoney(deadPlayerName, entityValue / 5);
        moneyAboveNegatives(deadPlayerName);
      });
    }
  }
}


function moneyAboveNegatives(playerName) {
  _commands.default.testMoney(playerName, '*', '-1', params => {
    if (params.success) {
      _commands.default.setMoney(playerName, 0);
    }
  });
}

},{"../helpers/commands":1,"../helpers/delay":2,"../helpers/emit":3,"../helpers/entities":4,"../helpers/item_functions":5,"../helpers/log":6}]},{},[8]);
