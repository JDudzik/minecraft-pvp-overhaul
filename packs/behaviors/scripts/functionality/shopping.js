const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import entities from '../helpers/entities';
import {numberWithCommas} from '../helpers/misc';
import commands from '../helpers/commands';
const cmd = commands.cmd;


const kioskLocations = {
  '757,72,-175': 'buy_minecart_1',
}

const shopData = {
  'buy_minecart_1': {
    action: 'buy',
    slug: 'minecart',
    pretty_name:'Minecart',
    quantity: 1,
    data_id: 0,
    price: 500,
  },
  // 'buy_glass_32': {
  //   action: 'buy',
  //   slug: 'glass',
  //   pretty_name: 'Glass Blocks',
  //   quantity: 32,
  //   price: 1600,
  //   data_id: 0,
  // },
}



const kioskAction = (blockLocationObject) => kioskLocations[Object.values(blockLocationObject).join(',')];

function validateAndUseKiosk(params) {
  const kiosk = kioskAction(params.data.block_position);
  if (kiosk) {
    const kioskValues = shopData[kiosk];
    const playerName = entities.getPlayerName(params.data.player);

    commands.testMoney(playerName, kioskValues.price, '*', (params) => {
      if (!params.success) {
        const playerMoney = params.message.match(/Score\s(.+?)\sis\sNOT\sin\srange/)[1];
        const remainingCost = numberWithCommas(kioskValues.price - playerMoney);
        commands.msgPlayer(playerName, `§cYou can't afford that! §r§7You need §e§l${remainingCost} §r§7more Coins.`);
      }

      if (params.success) {
        const {slug, pretty_name, quantity, data_id, price} = kioskValues;
        commands.remMoney(playerName, price);
        commands.giveItem(playerName, slug, quantity, data_id);
        commands.msgPlayer(playerName, `§aBought §l§6${quantity} §f${pretty_name} §r§7for §l§e${numberWithCommas(price)} §r§7Coins`);
      }
    })
  }
}



export default {validateAndUseKiosk}


//    Sign noting how to use kiosk:
// §eRight-click §f/ §eTap
// §fthe §bSigns
// §fto §aBuy
