const system = server.registerSystem(0, 0);
import uidTranslations from '../helpers/uidTranslations';


const getPlayerName = playerData => system.getComponent(playerData, "minecraft:nameable").data.name
const getEntityTitle = entity => uidTranslations.uidToName[entity.__identifier__] || undefined;
const getEntityValue = entity => uidTranslations.uidToValue[entity.__identifier__] || 0;


export default {
  getPlayerName,
  getEntityTitle,
  getEntityValue,
}
