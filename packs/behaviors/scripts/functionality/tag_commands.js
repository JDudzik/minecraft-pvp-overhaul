const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import global_storage from '../helpers/global_storage';
import bans from '../functionality/bans';

const masterCommandTagName = 'master_command_entity';



function say(message, message2) {
  log(message);
  if (message2) {
    log(message2);
  }
}


function ban(name, duration, durationType = 'hours') {
  bans.add_ban(name, duration, durationType);
}




const commandMap = {
  say,
  ban,
}



let masterCommandEntity = undefined;
function watchCommandEntity() {
  if (!masterCommandEntity) {
  	system.getEntitiesFromQuery(system.registerQuery()).forEach(entity => {
  		if (entity.__identifier__ === "minecraft:armor_stand") {
  			const entityTags = entities.getTags(entity);
        if (entityTags.includes(masterCommandTagName)) {
          commands.msgTarget('@a[tag=super_admin]', `§9Found new master command entity!`);
          masterCommandEntity = entity;
        }
  		}
  	})
  }

  if (masterCommandEntity) {
    if (!entities.hasComponent(masterCommandEntity, 'minecraft:tag')) {
      commands.msgTarget('@a[tag=super_admin]', `§cLost master command entity!`);
      masterCommandEntity = undefined;
      return;
    }

    const tagObject = entities.getComponent(masterCommandEntity, 'minecraft:tag');
    const cmdTags = tagObject.data.map(tag => tag.split('/')).filter(tag => tag[0] === 'cmd');

    if (cmdTags.length) {
      cmdTags.forEach(cmdTag => {
        const [cmdDecla, commandName, ...parameters] = cmdTag;
        const commandToRun = commandMap[commandName];
        if (!commandMap[commandName]) {
          commands.msgTarget('@a[tag=super_admin]', `§cThe command §l${commandName} §r§cdoes not exist`);
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
