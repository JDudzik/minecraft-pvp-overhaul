const system = server.registerSystem(0, 0);
import log from './log';

let currTick = 0;
let actions = [];
let rapidActions = [];
let rapidActionsQueue = [];

function create(delayInTicks, callback, debugMsg) {
  actions.push({
    start: currTick,
    delay: delayInTicks,
    callback: callback,
    completed: false,
    debugMsg: debugMsg,
  });
}


function createRapid(delayInTicks, callback, debugMsg) {
  rapidActionsQueue.push({
    start: currTick,
    delay: delayInTicks,
    callback: callback,
    completed: false,
    debugMsg: debugMsg,
  });
}


function checkActions(gameTick) {
  let firedAtLeastOne = false;

  actions.forEach((action, index) => {
    const ticksPassed = gameTick - action.start;
    if (ticksPassed >= action.delay && !action.completed) {
      if (action.debugMsg) { log(`${gameTick} --- ${action.debugMsg}`); }
      action.callback();
      action.completed = true;
      firedAtLeastOne = true;
    }
  })

  if (firedAtLeastOne) {
    actions = actions.filter((action) => !action.completed);
  }
}


function checkRapidActions(gameTick) {
  currTick = gameTick;
  if (rapidActions.length <= 0 && rapidActionsQueue.length <= 0) { return; }
  // log(rapidActions.length, rapidActionsQueue.length);

  if (rapidActionsQueue.length > 0 && rapidActions.length <= 10) {
    const itemCountToMove = rapidActionsQueue.length <= 10 ? rapidActionsQueue.length : 10;

    const swappedItems = rapidActionsQueue.splice(0, itemCountToMove);
    rapidActions.splice(-1, 0, ...swappedItems);
  }

  let firedAtLeastOne = false;
  rapidActions.forEach((action, index) => {
    const ticksPassed = gameTick - action.start;
    if (ticksPassed >= action.delay && !action.completed) {
      if (action.debugMsg) { log(`${gameTick} --- ${action.debugMsg}`); }
      action.callback();
      action.completed = true;
      firedAtLeastOne = true;
    }
  })

  if (firedAtLeastOne) {
    rapidActions = rapidActions.filter((action) => !action.completed);
  }
}


export default {
  create,
  checkActions,
  createRapid,
  checkRapidActions,
};
