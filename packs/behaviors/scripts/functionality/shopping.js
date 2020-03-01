const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import entities from '../helpers/entities';
import {numberWithCommas} from '../helpers/misc';
import commands from '../helpers/commands';
const cmd = commands.cmd;


const kioskLocations = {
  // Minecart
  '2002,32,3004': 'buy-minecart-1',
  '2003,32,3002': 'buy-chestcart-1',
  '2006,32,3002': 'buy-hoppercart-1',
  '2006,32,3008': 'buy-activator_rails-5',
  '2006,32,3011': 'buy-powered_rails-5',
  '2005,32,3011': 'buy-powered_rails-32',
  '2003,32,3011': 'buy-detector_rails-5',
  '2002,32,3011': 'buy-detector_rails-32',
  '2002,32,3009': 'buy-rails-5',
  '2002,32,3008': 'buy-rails-16',
  '2002,32,3007': 'buy-rails-64',

  // Redstone
  '2003,31,3205': 'buy-levers-3',
  '2005,31,3202': 'buy-redstone-5',
  '2006,31,3202': 'buy-redstone-16',
  '2007,31,3202': 'buy-redstone-64',
  '2011,31,3202': 'buy-daylight_sensor-1',
  '2014,31,3204': 'buy-tripwire-2',
  '2014,31,3206': 'buy-redstone_lamp-5',
  '2014,31,3208': 'buy-observer-1',
  '2014,31,3210': 'buy-dropper-1',
  '2012,31,3213': 'buy-dispenser-1',
  '2008,31,3213': 'buy-comparator-1',
  '2004,31,3213': 'buy-hopper-1',
  '2006,31,3207': 'buy-redstone_torch-5',
  '2006,31,3208': 'buy-redstone_torch-16',
  '2009,31,3205': 'buy-sticky_piston-1',
  '2008,31,3205': 'buy-sticky_piston-10',
  '2011,31,3208': 'buy-piston-1',
  '2011,31,3207': 'buy-piston-10',
  '2008,31,3210': 'buy-repeater-2',
  '2009,31,3210': 'buy-repeater-16',

  // Food
  '2002,29,3403': 'buy-cookie-5',
  '2003,29,3402': 'buy-pie-2',
  '2007,29,3402': 'buy-rabbit_stew-1',
  '2009,29,3402': 'buy-cooked_salmon-1',
  '2009,29,3404': 'buy-cake-1',
  '2009,29,3406': 'buy-golden_apple-1',

  // Abilities
  '2018,8,3628': 'buy-arrow_rain-1',
  '2018,8,3626': 'buy-balloonify-1',
  '2012,8,3628': 'buy-blink-8',
  '2012,8,3620': 'buy-coin_tablet-1',
  '2012,8,3624': 'buy-locate_home-1',
  '2012,8,3626': 'buy-save_home-1',
  '2012,8,3622': 'buy-locator-6',

  // Spawn Eggs
  '2018,8,3620': 'buy-spider-1',
  '2018,8,3622': 'buy-husk-3',
  '2018,8,3624': 'buy-stray-1',
}




const shopData = {
  // Minecart
  'buy-minecart-1': {
    action: 'buy',
    slug: 'minecart',
    data_id: 0,
    pretty_name:'Minecart',
    quantity: 1,
    price: 500,
  },
  'buy-chestcart-1': {
    action: 'buy',
    slug: 'chest_minecart',
    pretty_name: 'Minecart - Chest',
    quantity: 1,
    price: 1500,
  },
  'buy-hoppercart-1': {
    action: 'buy',
    slug: 'hopper_minecart',
    pretty_name: 'Minecart - Hopper',
    quantity: 1,
    price: 2000,
  },
  'buy-activator_rails-5': {
    action: 'buy',
    slug: 'activator_rail',
    pretty_name: 'Activator Rails',
    quantity: 5,
    price: 1250,
  },
  'buy-powered_rails-5': {
    action: 'buy',
    slug: 'golden_rail',
    pretty_name: 'Powered Rails',
    quantity: 5,
    price: 1250,
  },
  'buy-powered_rails-32': {
    action: 'buy',
    slug: 'golden_rail',
    pretty_name: 'Powered Rails',
    quantity: 32,
    price: 8000,
  },
  'buy-detector_rails-5': {
    action: 'buy',
    slug: 'detector_rail',
    pretty_name: 'Detector Rails',
    quantity: 5,
    price: 1250,
  },
  'buy-detector_rails-32': {
    action: 'buy',
    slug: 'detector_rail',
    pretty_name: 'Detector Rails',
    quantity: 32,
    price: 8000,
  },
  'buy-rails-5': {
    action: 'buy',
    slug: 'rail',
    pretty_name: 'Rails',
    quantity: 5,
    price: 250,
  },
  'buy-rails-16': {
    action: 'buy',
    slug: 'rail',
    pretty_name: 'Rails',
    quantity: 16,
    price: 800,
  },
  'buy-rails-64': {
    action: 'buy',
    slug: 'rail',
    pretty_name: 'Rails',
    quantity: 64,
    price: 3200,
  },

  // Redstone
  'buy-levers-3': {
    action: 'buy',
    slug: 'lever',
    pretty_name: 'Levers',
    quantity: 3,
    price: 45,
  },
  'buy-redstone-5': {
    action: 'buy',
    slug: 'redstone',
    pretty_name: 'Redstone',
    quantity: 5,
    price: 100,
  },
  'buy-redstone-16': {
    action: 'buy',
    slug: 'redstone',
    pretty_name: 'Redstone',
    quantity: 16,
    price: 320,
  },
  'buy-redstone-64': {
    action: 'buy',
    slug: 'redstone',
    pretty_name: 'Redstone',
    quantity: 64,
    price: 1280,
  },
  'buy-daylight_sensor-1': {
    action: 'buy',
    slug: 'daylight_detector',
    pretty_name: 'Daylight Sensor',
    quantity: 1,
    price: 550,
  },
  'buy-tripwire-2': {
    action: 'buy',
    slug: 'tripwire_hook',
    pretty_name: 'Tripwire Hooks',
    quantity: 2,
    price: 1100,
  },
  'buy-redstone_lamp-5': {
    action: 'buy',
    slug: 'redstone_lamp',
    pretty_name: 'Redstone Lamps',
    quantity: 5,
    price: 1750,
  },
  'buy-observer-1': {
    action: 'buy',
    slug: 'observer',
    pretty_name: 'Observer',
    quantity: 1,
    price: 250,
  },
  'buy-dropper-1': {
    action: 'buy',
    slug: 'dropper',
    pretty_name: 'Dropper',
    quantity: 1,
    price: 150,
  },
  'buy-dispenser-1': {
    action: 'buy',
    slug: 'dispenser',
    pretty_name: 'Dispenser',
    quantity: 1,
    price: 200,
  },
  'buy-comparator-1': {
    action: 'buy',
    slug: 'comparator',
    pretty_name: 'Comparator',
    quantity: 1,
    price: 350,
  },
  'buy-hopper-1': {
    action: 'buy',
    slug: 'hopper',
    pretty_name: 'Hopper',
    quantity: 1,
    price: 650,
  },
  'buy-redstone_torch-5': {
    action: 'buy',
    slug: 'redstone_torch',
    pretty_name: 'Redstone Torches',
    quantity: 5,
    price: 200,
  },
  'buy-redstone_torch-16': {
    action: 'buy',
    slug: 'redstone_torch',
    pretty_name: 'Redstone Torches',
    quantity: 16,
    price: 640,
  },
  'buy-sticky_piston-1': {
    action: 'buy',
    slug: 'sticky_piston',
    pretty_name: 'Sticky Piston',
    quantity: 1,
    price: 550,
  },
  'buy-sticky_piston-10': {
    action: 'buy',
    slug: 'sticky_piston',
    pretty_name: 'Sticky Pistons',
    quantity: 10,
    price: 5500,
  },
  'buy-piston-1': {
    action: 'buy',
    slug: 'piston',
    pretty_name: 'Piston',
    quantity: 1,
    price: 500,
  },
  'buy-piston-10': {
    action: 'buy',
    slug: 'piston',
    pretty_name: 'Pistons',
    quantity: 10,
    price: 5000,
  },
  'buy-repeater-2': {
    action: 'buy',
    slug: 'repeater',
    pretty_name: 'Repeaters',
    quantity: 2,
    price: 200,
  },
  'buy-repeater-16': {
    action: 'buy',
    slug: 'repeater',
    pretty_name: 'Repeaters',
    quantity: 16,
    price: 1600,
  },

  // Food
  'buy-cookie-5': {
    action: 'buy',
    slug: 'cookie',
    pretty_name: 'Cookies',
    quantity: 5,
    price: 300,
  },
  'buy-pie-2': {
    action: 'buy',
    slug: 'pumpkin_pie',
    pretty_name: 'Pumpkin Pies',
    quantity: 2,
    price: 960,
  },
  'buy-rabbit_stew-1': {
    action: 'buy',
    slug: 'rabbit_stew',
    pretty_name: 'Rabbit Stew',
    quantity: 1,
    price: 590,
  },
  'buy-cooked_salmon-1': {
    action: 'buy',
    slug: 'cooked_salmon',
    pretty_name: 'Cooked Salmon',
    quantity: 1,
    price: 300,
  },
  'buy-cake-1': {
    action: 'buy',
    slug: 'cake',
    pretty_name: 'Cake',
    quantity: 1,
    price: 1010,
  },
  'buy-golden_apple-1': {
    action: 'buy',
    slug: 'golden_apple',
    pretty_name: 'Golden Apple',
    quantity: 1,
    price: 3500,
  },

  // Abilities
  'buy-arrow_rain-1': {
    action: 'buy',
    slug: 'pvpcontrols:arrow_rain',
    pretty_name: 'Arrow Rain',
    quantity: 1,
    price: 620,
  },
  'buy-balloonify-1': {
    action: 'buy',
    slug: 'pvpcontrols:balloonify',
    pretty_name: 'Balloonify',
    quantity: 1,
    price: 620,
  },
  'buy-blink-8': {
    action: 'buy',
    slug: 'pvpcontrols:blink',
    pretty_name: 'Blink',
    quantity: 8,
    price: 1240,
  },
  'buy-coin_tablet-1': {
    action: 'buy',
    slug: 'pvpcontrols:coin_tablet',
    pretty_name: 'Coin Tablet',
    quantity: 1,
    price: 550,
  },
  'buy-locate_home-1': {
    action: 'buy',
    slug: 'pvpcontrols:locate_home_point',
    pretty_name: 'Locate Home Point',
    quantity: 1,
    price: 186,
  },
  'buy-save_home-1': {
    action: 'buy',
    slug: 'pvpcontrols:save_home_point',
    pretty_name: 'Save Home Point',
    quantity: 1,
    price: 3720,
    additional_items: [
      {
        slug: 'pvpcontrols:locate_home_point',
        quantity: 1
      }
    ],
  },
  'buy-locator-6': {
    action: 'buy',
    slug: 'pvpcontrols:locator',
    data_id: 35,
    pretty_name: 'Locator',
    quantity: 6,
    price: 3720,
  },

  // Spawn Eggs
  'buy-spider-1': {
    action: 'buy',
    slug: 'spawn_egg',
    data_id: 35,
    pretty_name: 'Spider Egg',
    quantity: 1,
    price: 372,
  },
  'buy-husk-3': {
    action: 'buy',
    slug: 'spawn_egg',
    data_id: 47,
    pretty_name: 'Husk Eggs',
    quantity: 3,
    price: 1860,
  },
  'buy-stray-1': {
    action: 'buy',
    slug: 'spawn_egg',
    data_id: 46,
    pretty_name: 'Stray Egg',
    quantity: 1,
    price: 1240,
  },

  // Offensive Gear
  'buy-iron_sword-1': {
    action: 'buy',
    slug: 'iron_sword',
    pretty_name: 'Iron Sword',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_sword-1': {
    action: 'buy',
    slug: 'diamond_sword',
    pretty_name: 'Diamond Sword',
    quantity: 1,
    price: 0,
  },
  'buy-crossbow-1': {
    action: 'buy',
    slug: 'crossbow',
    pretty_name: 'Crossbow',
    quantity: 1,
    price: 0,
  },
  'buy-bow-1': {
    action: 'buy',
    slug: 'bow',
    pretty_name: 'Bow',
    quantity: 1,
    price: 0,
  },
  'buy-arrow-___': {
    action: 'buy',
    slug: 'arrow',
    pretty_name: 'Arrow',
    quantity: 99999,
    price: 0,
  },
  'buy-arrow_slow-_': {
    action: 'buy',
    slug: 'arrow',
    pretty_name: 'Arrow of Slowness',
    quantity: 99999,
    price: 0,
    data_id: 19,
  },
  'buy-arrow_poison-_': {
    action: 'buy',
    slug: 'arrow',
    pretty_name: 'Arrow of Poison',
    quantity: 99999,
    price: 0,
    data_id: 26,
  },
  'buy-arrow_weakness-_': {
    action: 'buy',
    slug: 'arrow',
    pretty_name: 'Arrow of Weakness',
    quantity: 99999,
    price: 0,
    data_id: 35,
  },

  // Defensive Gear
  'buy-shield-1': {
    action: 'buy',
    slug: 'shield',
    pretty_name: 'Shield',
    quantity: 1,
    price: 0,
  },
  'buy-chainmail_helmet-1': {
    action: 'buy',
    slug: 'chainmail_helmet',
    pretty_name: 'Chainmail Helmet',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_helmet-1': {
    action: 'buy',
    slug: 'diamond_helmet',
    pretty_name: 'Diamnd Helmet',
    quantity: 1,
    price: 0,
  },
  'buy-chainmail_chestplate-1': {
    action: 'buy',
    slug: 'chainmail_chestplate',
    pretty_name: 'Chainmail Chestplate',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_chestplate-1': {
    action: 'buy',
    slug: 'diamond_chestplate',
    pretty_name: 'Diamond Chestplate',
    quantity: 1,
    price: 0,
  },
  'buy-chainmail_leggings-1': {
    action: 'buy',
    slug: 'chainmail_leggings',
    pretty_name: '___',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_leggings-1': {
    action: 'buy',
    slug: 'diamond_leggings',
    pretty_name: 'Diamond Leggings',
    quantity: 1,
    price: 0,
  },
  'buy-chainmail_boots-1': {
    action: 'buy',
    slug: 'chainmail_boots',
    pretty_name: 'Chainmail Boots',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_boots-1': {
    action: 'buy',
    slug: 'diamond_boots',
    pretty_name: 'Diamond Boots',
    quantity: 1,
    price: 0,
  },
  'buy-horsearmoriron-1': {
    action: 'buy',
    slug: 'horsearmoriron',
    pretty_name: 'Iron Horse Armor',
    quantity: 1,
    price: 0,
  },
  'buy-horsearmordiamond-1': {
    action: 'buy',
    slug: 'horsearmordiamond',
    pretty_name: 'Diamond Horse Armor',
    quantity: 1,
    price: 0,
  },

  // Tools
  'buy-iron_axe-1': {
    action: 'buy',
    slug: 'iron_axe',
    pretty_name: 'Iron Axe',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_axe-1': {
    action: 'buy',
    slug: 'diamond_axe',
    pretty_name: 'Diamond Axe',
    quantity: 1,
    price: 0,
  },
  'buy-iron_pickaxe-1': {
    action: 'buy',
    slug: 'iron_pickaxe',
    pretty_name: 'Iron Pickaxe',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_pickaxe-1': {
    action: 'buy',
    slug: 'diamond_pickaxe',
    pretty_name: 'Diamond Pickaxe',
    quantity: 1,
    price: 0,
  },
  'buy-iron_shovel-1': {
    action: 'buy',
    slug: 'iron_shovel',
    pretty_name: 'Iron Shovel',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_shovel-1': {
    action: 'buy',
    slug: 'diamond_shovel',
    pretty_name: 'Diamond Shovel',
    quantity: 1,
    price: 0,
  },
  'buy-iron_hoe-1': {
    action: 'buy',
    slug: 'iron_hoe',
    pretty_name: 'Iron Hoe',
    quantity: 1,
    price: 0,
  },
  'buy-diamond_hoe-1': {
    action: 'buy',
    slug: 'diamond_hoe',
    pretty_name: 'Diamond Hoe',
    quantity: 1,
    price: 0,
  },

  // Misc
  'buy-snowball-16': {
    action: 'buy',
    slug: 'snowball',
    pretty_name: 'Snowball',
    quantity: 16,
    price: 0,
  },
  'buy-elytra-1': {
    action: 'buy',
    slug: 'elytra',
    pretty_name: 'Elytre',
    quantity: 1,
    price: 0,
  },
  'buy-totem-1': {
    action: 'buy',
    slug: 'totem',
    pretty_name: 'Totem of Undying',
    quantity: 1,
    price: 0,
  },




  // 'buy-______-_____': {
  //   action: 'buy',
  //   slug: '______',
  //   pretty_name: '___',
  //   quantity: _____,
  //   price: 0,
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
        const {slug, pretty_name, quantity, data_id, price, additional_items} = kioskValues;
        cmd(`playsound random.click ${playerName}`);
        commands.remMoney(playerName, price);
        commands.giveItem(playerName, slug, quantity, data_id);
        if (additional_items && additional_items.length > 0) {
          additional_items.forEach(item => commands.giveItem(playerName, item.slug, item.quantity, item.data_id));
        }
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





// Gear store - 19:
// Offensive:
// - iron, diamond sword
// - Bow
// - crossbow
// - arrows
// - arrows_slow
// - arrows_poison
// - arrows_weakness

// defensive:
// - chain, diamond Helmet
// - chain, diamond chest
// - chain, diamond pants
// - chain, diamond boots
// - diamond boots
// - iron horse armor
// - diamond horse armor
// - shield



// Everything Else Store - 15:
// Tools:
// - iron, diamond axe
// - iron, diamond pickaxe
// - iron, diamond hoe
// - iron, diamond shovel

// Misc:
// - Snowballs
// - Elytra
// - Totem
// - ...
// - ...
// - ...
// - ...
