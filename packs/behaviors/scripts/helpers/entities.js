const system = server.registerSystem(0, 0);
import uidTranslations from '../functionality/uidTranslations';


const getEntityTitle = entity => uidTranslations.uidToName[entity.__identifier__] || undefined;
const getEntityValue = entity => uidTranslations.uidToValue[entity.__identifier__] || 0;


const getPlayerName = playerData => getComponent(playerData, "minecraft:nameable").data.name;
const getPosition = entity => getComponent(entity, 'minecraft:position').data;
const getTags = entity => getComponent(entity, 'minecraft:tag').data;
const getComponent = (entity, component) => system.getComponent(entity, component);
const hasComponent = (entity, component) => system.hasComponent(entity, component);

const isValid = entity => system.isValidEntity(entity);


const addTag = (entity, tag) => {
  const entityTags = system.getComponent(entity, "minecraft:tag");
  entityTags.data.push(tag);
  system.applyComponentChanges(entity, entityTags);
}
const remTag = (entity, tag) => {
  const entityTags = system.getComponent(entity, "minecraft:tag");
  const index = entityTags.data.findIndex(tag => tag) || -1;
  if (index !== -1) {
    entityTags.data.splice(index, 1, stringedData);
    system.applyComponentChanges(entity, entityTags);
  }
}
const hasTag = (entity, tag) => {
  const entityTags = system.getComponent(entity, "minecraft:tag");
  const index = entityTags.data.findIndex(tag => tag) || -1;
  return index !== -1;
}


export default {
  getEntityTitle,
  getEntityValue,

  getPosition,
  getPlayerName,
  getTags,
  getComponent,
  hasComponent,

  isValid,

  addTag,
  remTag,
  hasTag,
}
