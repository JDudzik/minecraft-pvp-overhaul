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



export default {
  getEntityTitle,
  getEntityValue,

  getPosition,
  getPlayerName,
  getTags,
  getComponent,
  hasComponent,

  isValid,
}
