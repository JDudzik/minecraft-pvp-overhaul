const system = server.registerSystem(0, 0);
// import log from './log';

let currTick = 0;
let actions = [];

function create(delayInTicks, callback) {
  actions.push({
    start: currTick,
    delay: delayInTicks,
    callback: callback,
    completed: false,
  });
}

function checkActions(newCurrTick) {
  currTick = newCurrTick;
  let firedAtLeastOne = false;

  actions.forEach((action, index) => {
    const ticksPassed = currTick - action.start;
    if (ticksPassed >= action.delay && !action.completed) {
      action.callback();
      action.completed = true;
      firedAtLeastOne = true;
    }
  })

  if (firedAtLeastOne) {
    actions = actions.filter((action) => !action.completed);
  }
}


export default {create, checkActions};
