const system = server.registerSystem(0, 0);
import log from './log';

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
const cmd = (command, callback) => system.executeCommand(`/${command}`, (params) => cmdCallback(params, callback));


const cmdCallback = (params, callback) => callback
  ? callback({success: !params.data.statusCode, object: params})
  : () => null;



export default {
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
  nearbyPlayers,
}
