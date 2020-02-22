const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import global_storage from '../helpers/global_storage';
import restrictions from '../functionality/restrictions';

const masterCommandTagName = 'mce';



function say(message, message2) {
  log(message);
  log(message2);
}

function announce(message, paddingColor, mainColor) {
  const colors = {red: '§c', yellow: '§e', green: '§a', aqua: '§b', purple: '§d', blue: '§9'};
  commands.msgTarget(`@a`, `${colors[paddingColor] || '§e'}----------------------------------------------------------`);
  commands.msgTarget(`@a`, `${colors[paddingColor] || '§e'}----------------------------------------------------------`);
  commands.msgTarget(`@a`, `${colors[mainColor] || ''}${message}`);
  commands.msgTarget(`@a`, `${colors[paddingColor] || '§e'}----------------------------------------------------------`);
  commands.msgTarget(`@a`, `${colors[paddingColor] || '§e'}----------------------------------------------------------`);
}

function tags(recipient, target) {
  if (!recipient) { commands.msgServerTech(`§cYou must provide the "recipient" parameter`); }
  commands.cmd(`tag ${target || recipient} list`, (params) => {
    commands.msgPlayer(recipient, `§bMessage: §r${params.message}`);
  });
}



const commandMap = {
  say: say,
  announce: announce,
  tags: tags,
  ban: restrictions.add_ban,
  lock: restrictions.lock,
  unlock: restrictions.unlock,
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

        try { commandToRun(...parameters) } catch(error) {}
      });

      tagObject.data = [masterCommandTagName];
      system.applyComponentChanges(masterCommandEntity, tagObject);
    }
  }
}



export default {watchCommandEntity}
