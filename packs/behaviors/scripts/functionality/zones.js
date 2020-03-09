const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import delay from '../helpers/delay';
import storage from '../helpers/storage';
import entities from '../helpers/entities';
import commands from '../helpers/commands';
const cmd = commands.cmd;

const tagsToIgnore = `tag=!in_safe_zone,tag=!no_pvp_player,m=!c`;



function updatePlayerZoneTags(zone_tag, zone_entity_tag) {
  // Test and remove zone for players outside of it
  cmd(`execute @a[tag=${zone_tag},${tagsToIgnore}] ~~~ testfor @e[type=armor_stand,tag=${zone_entity_tag},r=5]`, (params) => {
    if (!params.success && params.object.data.failedEntities) {
      const failedPlayers = params.object.data.failedEntities;
      failedPlayers.forEach(player => cmd(`tag @a[name="${player}"] remove ${zone_tag}`));
    }
  });

  // Add zone to players who are inside of it
  cmd(`execute @e[type=armor_stand,tag=${zone_entity_tag}] ~~~ tag @a[tag=!${zone_tag},${tagsToIgnore},r=5] add ${zone_tag}`);
}




export default {
  updatePlayerZoneTags
}
