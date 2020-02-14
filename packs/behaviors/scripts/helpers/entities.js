const system = server.registerSystem(0, 0);
import uidTranslations from '../helpers/uidTranslations';


const getEntityTitle = entity => uidTranslations.uidToName[entity.__identifier__] || undefined;
const getEntityValue = entity => uidTranslations.uidToValue[entity.__identifier__] || 0;


const getPlayerName = playerData => system.getComponent(playerData, "minecraft:nameable").data.name;
const getPosition = entity => getComponent(entity, 'minecraft:position').data;
const getComponent = (entity, component) => system.getComponent(entity, component);



export default {
  getEntityTitle,
  getEntityValue,

  getPosition,
  getPlayerName,
  getComponent,
}
