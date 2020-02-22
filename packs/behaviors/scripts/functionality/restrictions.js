const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import delay from '../helpers/delay';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import global_storage from '../helpers/global_storage';

const banDataName = 'ban_list';



function add_ban(name, duration = 10, durationType = 'hours') {
  if (!name) {
    commands.msgServerTech(`§cYou did not provide a user to ban in your command`);
    return;
  }

  let banTimeinMilliseconds = 0;
  if (durationType === 'minutes' || durationType === 'minute') { banTimeinMilliseconds = toMil(toSeconds(duration)); }
  if (durationType === 'hours'   || durationType === 'hour' )  { banTimeinMilliseconds = toMil(toSeconds(toMinutes(duration))); }
  if (durationType === 'days'    || durationType === 'day')    { banTimeinMilliseconds = toMil(toSeconds(toMinutes(toHours(duration)))); }

  const banList = global_storage.getData(banDataName, {});
  const currentTime = Date.now();
  banList[name] = {
    banned_at: currentTime,
    ends_at: currentTime + banTimeinMilliseconds,
  }
  global_storage.updateData(banDataName, banList);

  commands.msgPlayer(name, `§4----------------------------------------------------------`);
  commands.msgPlayer(name, `§4----------------------------------------------------------`);
  commands.msgPlayer(name, `§cYou have been §lbanned§r§c! You're banned for §a§l${duration} ${durationType}`);
  commands.msgPlayer(name, `§4----------------------------------------------------------`);
  commands.msgPlayer(name, `§4----------------------------------------------------------`);
  delay.create(240, () => {
    commands.cmdAsOwner(`kick ${name}`);
  });
}


function checkAndEnforceBan(playerName) {
  const banList = global_storage.getData(banDataName, {});
  const banData = banList[playerName];

  if (banData) {
    const currentTime = Date.now();
    if (banData.ends_at > currentTime) {
      commands.cmdAsOwner(`kick ${name}`);
    }
    if (banData.ends_at <= currentTime) {
      banList[playerName] = undefined;
      global_storage.updateData(banDataName, banList);
    }
  }
}


function lock(playerName, reason = "N/A") {
  commands.cmd(`tp @a[name="${playerName}"] 4000 3 3000`);
  commands.cmd(`tag @a[name="${playerName}"] add locked_player`);
  commands.cmd(`tag @a[name="${playerName}"] add in_safe_zone`);
  commands.cmd(`tag @a[name="${playerName}"] add in_protected_zone`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
  commands.msgPlayer(playerName, `§cYou have been §llocked-up§r§c! Reason: §a§l${reason}`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
}

function unlock(playerName, reason = "N/A") {
  commands.cmd(`tag @a[name="${playerName}"] remove locked_player`);
  commands.cmd(`tp @a[name="${playerName}"] 3000 165 3000`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
  commands.msgPlayer(playerName, `§aYou have been §lfreed§r§a! Reason: §a§l${reason}`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
  commands.msgPlayer(playerName, `§4----------------------------------------------------------`);
}





//////////////////////
// Internal Methods //
//////////////////////

const toHours = days => days * 24;
const toMinutes = hours => hours * 60;
const toSeconds = minutes => minutes * 60;
const toMil = seconds => seconds * 1000;





export default {
  add_ban,
  checkAndEnforceBan,
  lock,
  unlock,
}
