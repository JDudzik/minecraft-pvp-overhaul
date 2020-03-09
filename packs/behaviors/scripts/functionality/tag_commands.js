const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import global_storage from '../helpers/global_storage';
import restrictions from '../functionality/restrictions';
import xray_anticheat from '../functionality/xray_anticheat';
import block_manipulation from '../functionality/block_manipulation';

const masterCommandTagName = 'mce';
const colors = {red: '§c', yellow: '§e', green: '§a', aqua: '§b', purple: '§d', blue: '§9'};


function test(recipient) {
  if (!recipient) {
    commands.msgServerTech('§aTest was successful');
    return;
  }
  commands.msgPlayer(recipient, '§aTest was successful');
}


function say(recipient, message, color) {
  commands.msgPlayer(recipient, `${colors[color] || ''}${message}`);
}


function announce(message, paddingColor, mainColor) {
  commands.msgTarget(`@a`, `${colors[paddingColor] || colors['yellow']}----------------------------------------------------------`);
  commands.msgTarget(`@a`, `${colors[paddingColor] || colors['yellow']}----------------------------------------------------------`);
  commands.msgTarget(`@a`, `${colors[mainColor] || ''}${message}`);
  commands.msgTarget(`@a`, `${colors[paddingColor] || colors['yellow']}----------------------------------------------------------`);
  commands.msgTarget(`@a`, `${colors[paddingColor] || colors['yellow']}----------------------------------------------------------`);
}


function tags(recipient, target, showData = false) {
  commands.cmd(`tag ${target || recipient} list`, (params) => {
    const allTags = params.message.match(/.+?\shas\s\d+?\stags:\s(.+?)$/);
    if (allTags && allTags.length >= 2) {
      const tagArray = allTags[1].split(', ');
      const indexOfDataTag = tagArray.findIndex(tag => tag[2] === "{") || -1;

      if (showData) {
        commands.msgPlayer(recipient, `§6${target || recipient}§r data tag: ${tagArray[indexOfDataTag]}`);
      } else {
        if (indexOfDataTag !== -1) { tagArray.splice(indexOfDataTag, 1); }
        commands.msgPlayer(recipient, `§6${target || recipient}§r tags: ${tagArray.join(',  ')}`);
      }
    }
    else {
      commands.msgPlayer(recipient, `§6${target || recipient}§r Does not have any tags, Or something broke`);
    }
  });
}




const commandMap = {
  test: {
    method: test,
    requiredParamCount: 0,
  },
  say: {
    method: say,
    requiredParamCount: 2,
  },
  announce: {
    method: announce,
    requiredParamCount: 1,
  },
  tags: {
    method: tags,
    requiredParamCount: 1,
  },
  ban: {
    method: restrictions.add_ban,
    requiredParamCount: 1,
  },
  lock: {
    method: restrictions.lock,
    requiredParamCount: 1,
  },
  unlock: {
    method: restrictions.unlock,
    requiredParamCount: 1,
  },
  read_alerts: {
    method: xray_anticheat.readAlerts,
    requiredParamCount: 1,
  },
  clear_alert: {
    method: xray_anticheat.clearAlert,
    requiredParamCount: 1,
  },
  fill: {
    method: block_manipulation.fill,
    requiredParamCount: 8,
  }
}



let masterCommandEntity = undefined;
function watchCommandEntity() {
  if (!masterCommandEntity) {
  	system.getEntitiesFromQuery(system.registerQuery()).forEach(entity => {
  		if (entity.__identifier__ === "minecraft:armor_stand") {
  			const entityTags = entities.getTags(entity);
        if (entityTags.includes(masterCommandTagName)) {
          commands.msgServerTech(`§9Found new master command entity!`);
          masterCommandEntity = entity;
        }
  		}
  	})
  }

  if (masterCommandEntity) {
    if (!entities.hasComponent(masterCommandEntity, 'minecraft:tag')) {
      commands.msgServerTech(`§cLost master command entity!`);
      masterCommandEntity = undefined;
      return;
    }

    const tagObject = entities.getComponent(masterCommandEntity, 'minecraft:tag');
    const cmdTags = tagObject.data.filter(tag => tag[0] === '/').map(tag => tag.split('/'));

    if (cmdTags.length) {
      cmdTags.forEach(cmdTag => {
        const [empty, commandName, ...parameters] = cmdTag;
        const commandToRun = commandMap[commandName];
        if (!commandMap[commandName]) {
          commands.msgServerTech(`§cThe command §l${commandName} §r§cdoes not exist`);
          return;
        }

        const isMissingRequiredParams = missingRequiredParams(parameters, commandToRun.requiredParamCount);
        if (isMissingRequiredParams) {
          commands.msgServerTech(`§cThe command §l${commandName} §r§cis missing required parameters.`);
        }

        if (!isMissingRequiredParams) {
          try { commandToRun.method(...parameters) } catch(error) {}
        }
      });

      tagObject.data = [masterCommandTagName];
      system.applyComponentChanges(masterCommandEntity, tagObject);
    }
  }
}

const missingRequiredParams = (params, requiredParamCount) => requiredParamCount && (!params || params.length < requiredParamCount);


export default {watchCommandEntity}
