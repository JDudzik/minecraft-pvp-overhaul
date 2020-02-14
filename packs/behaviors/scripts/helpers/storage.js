const system = server.registerSystem(0, 0);
// import log from './log';


function getDataTag(entity) {
  const entityTags = system.getComponent(entity, "minecraft:tag");
  const index = getIndexOfDataTag(entityTags.data);

  if (index !== -1) {
    return JSON.parse(entityTags.data[index]) || {};
  } else {
    return {};
  }
}

function updateDataTag(entity, newData) {
  let entityTags = system.getComponent(entity, "minecraft:tag");
  const index = getIndexOfDataTag(entityTags.data);
  const stringedData = JSON.stringify(newData);

  if (index !== -1) {
    entityTags.data.splice(index, 1, stringedData);
  } else {
    entityTags.data.push(stringedData);
  }

  system.applyComponentChanges(entity, entityTags);
}

function dangerouslyDeleteEntireDataTag(entity) {
  let entityTags = system.getComponent(entity, "minecraft:tag");
  const index = getIndexOfDataTag(entityTags.data);

  if (index !== -1 ) {
    entityTags.data.splice(index, 1);
  }

  system.applyComponentChanges(entity, entityTags);
}



//////////////////////
// Internal Methods //
//////////////////////



const getIndexOfDataTag = (tagArray) => tagArray.findIndex(tag => tag[0] === "{") || -1;




export default {
  getDataTag,
  updateDataTag,
  dangerouslyDeleteEntireDataTag,
}
