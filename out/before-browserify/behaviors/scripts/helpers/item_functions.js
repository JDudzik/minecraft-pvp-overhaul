const system = server.registerSystem(0, 0);
import log from './log';
import delay from './delay';
import storage from './storage';
import entities from './entities';
import commands from './commands';
const cmd = commands.cmd;

const tagsToIgnore = `tag=!in_safe_zone,tag=!no_pvp_player`;


function arrow_rain(name, stack, entity) {
  cmd(commands.execAs(name, `testfor @a[rm=2,r=75,c=5,${tagsToIgnore}]`), (params) => {
    if (params.success) {
      for (let i = 0; i < 20; i++) {
        delay.create(i*6, () => arrowVolley(name));
      }
    }

    if (!params.success) {
      commands.giveItem(name, 'pvpcontrols:arrow_rain');
      commands.msgPlayer(name, `§cThere are no players in range!`);
    }
  })
}
function arrowVolley(playerName) {
  const minRadius = -2
  const maxRadius = 2;
  const baseHeight = 20;

  for (let i = 0; i < 3; i++) {
    const randX = Math.random() * (maxRadius - minRadius) + minRadius;
    const randY = Math.random() * (maxRadius - minRadius) + baseHeight;
    const randZ = Math.random() * (maxRadius - minRadius) + minRadius;
    cmd(`execute @a[name="${playerName}"] ~~~ execute @e[type=armor_stand,rm=2,r=75,c=5,${tagsToIgnore}] ~~~ summon arrow ~${randX} ~${randY} ~${randZ}`)
  }
}


function blink(name, stack, entity, dist = 20) {
  commands.tpAs(name, '^', '^2', `^${dist}`, true, (params) => {
    const newDist = dist - 10;
    if (!params.success && newDist > 0 ) {
      blink(name, undefined, undefined, newDist);
    }
    if (!params.success && newDist <= 0) {
      commands.giveItem(name, 'pvpcontrols:blink');
    }
  });
}


function coin_tablet(name, stack, entity) {
  commands.addMoney(name, 500);
  commands.msgPlayer(name, `§a+§e500 Coins`);
}


function balloonify(name, stack, entity) {
  cmd(commands.execAs(name, `effect @a[rm=2,r=1000,${tagsToIgnore}] levitation 20 0`), (params) => {
    if (!params.success) {
      commands.giveItem(name, 'pvpcontrols:balloonify');
      commands.msgPlayer(name, `§cThere are no players in range!`);
    }
  });
}


function locator(name, stack, entity) {
  cmd(commands.execAs(name, `tp ~~~ facing @p[rm=10,c=1,${tagsToIgnore}]`), (params) => {
    if (!params.success) {
      commands.giveItem(name, 'pvpcontrols:locator');
      commands.msgPlayer(name, `§cThere are no players who are locatable!`);
    }
  });
}


function mob_squad(name, stack, entity) {
  // commands.msgPlayer(name, `§cThis item is not implemented yet!`);
  // cmd(`scoreboard objectives list`, (params) => {
  //   log(params.object.data.statusMessage);
  // });


  commands.giveItem(name, `pvpcontrols:mob_squad`);

  // storage.dangerouslyDeleteEntireDataTag(entity);

}


function save_home_point(name, stack, entity) {
  commands.giveItem(name, `pvpcontrols:save_home_point`);

  const playerCoords = entities.getPosition(entity);
  const dataTag = storage.getDataTag(entity);
  if (!dataTag.homePosition) { dataTag.homePosition = {}; }
  dataTag.homePosition.x = playerCoords.x;
  dataTag.homePosition.y = playerCoords.y;
  dataTag.homePosition.z = playerCoords.z;
  storage.updateDataTag(entity, dataTag);
  commands.msgPlayer(name, `§aYour home point has been saved!`);
}


function locate_home_point(name, stack, entity) {
  commands.giveItem(name, `pvpcontrols:locate_home_point`);
  const coords = storage.getDataTag(entity).homePosition;

  if (!coords) {
    commands.msgPlayer(name, `§cYou don't have a home location, yet! §rBuy a §aSave Home Point §ritem from the shop to set one.`);
  }
  if (coords) {
    cmd(commands.execAs(name, `tp ~~~ facing ${coords.x} ${coords.y} ${coords.z}`));
  }
}





export default {
  'pvpcontrols:arrow_rain': {
    action: arrow_rain,
    disabled_in_safe_zone: true,
  },
  'pvpcontrols:blink': {
    action: blink,
    disabled_in_safe_zone: true,
  },
  'pvpcontrols:coin_tablet': {
    action: coin_tablet,
    disabled_in_safe_zone: false,
  },
  'pvpcontrols:balloonify': {
    action: balloonify,
    disabled_in_safe_zone: true,
  },
  'pvpcontrols:locator': {
    action: locator,
    disabled_in_safe_zone: true,
  },
  'pvpcontrols:mob_squad': {
    action: mob_squad,
    disabled_in_safe_zone: true,
  },
  'pvpcontrols:locate_home_point': {
    action: locate_home_point,
    disabled_in_safe_zone: true,
  },
  'pvpcontrols:save_home_point': {
    action: save_home_point,
    disabled_in_safe_zone: true,
  },
}
