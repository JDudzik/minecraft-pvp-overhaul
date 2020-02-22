const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import delay from '../helpers/delay';
import entities from '../helpers/entities';
import storage from '../helpers/storage';
import commands from '../helpers/commands';
const cmd = commands.cmd;

const globalDataTag = 'global_data';
let globalDataEntity = undefined;



function getData(key, defaultValue = {}) {
  const dataTag = storage.getDataTag(globalDataEntity);
  if (dataTag) {
    return dataTag[key] || defaultValue;
  }
  return defaultValue;
}

function updateData(key, newData) {
  const dataTag = storage.getDataTag(globalDataEntity);
  dataTag[key] = newData;
  storage.updateDataTag(globalDataEntity, dataTag);
}


function watchGlobalDataEntity() {
  if (!globalDataEntity) {
    system.getEntitiesFromQuery(system.registerQuery()).forEach(entity => {
      if (globalDataEntity) { return; }
      if (entity.__identifier__ === "minecraft:armor_stand") {
        const entityTags = entities.getTags(entity);
        if (entityTags.includes(globalDataTag)) {
          commands.msgServerTech(`§9Found new global data entity!`);
          globalDataEntity = entity;
        }
      }
    })
  }
  if (globalDataEntity) {
    if (!entities.hasComponent(globalDataEntity, 'minecraft:tag')) {
      commands.msgServerTech(`§cLost global data entity!`);
      globalDataEntity = undefined;
      return;
    }
  }
}



export default {
  watchGlobalDataEntity,
  getData,
  updateData,
}
