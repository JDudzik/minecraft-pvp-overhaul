const system = server.registerSystem(0, 0);
import log from '../helpers/log';
import delay from '../helpers/delay';
import commands from '../helpers/commands';
import entities from '../helpers/entities';
import global_storage from '../helpers/global_storage';

const delayIncrements = 3;


function fill(tpAgent, x1, y1, z1, x2, y2, z2, block, id = '0', fillMode = 'replace', replaceBlock = '', replaceId = '') {
  const fillString = `${block} ${id} replace ${replaceBlock} ${replaceId}`;

  const intX1 = int(x1);
  const intX2 = int(x2);
  const intY1 = int(y1);
  const intY2 = int(y2);
  const intZ1 = int(z1);
  const intZ2 = int(z2);

  const calcFirstX = intX1 <= intX2 ? intX1 : intX2;
  const calcLastX  = intX1 >= intX2 ? intX1 : intX2;
  const calcFirstZ = intZ1 <= intZ2 ? intZ1 : intZ2;
  const calcLastZ  = intZ1 >= intZ2 ? intZ1 : intZ2;

  if (fillMode === 'outline' || fillMode === 'outline-walls') {
    log('OUTLINE');
    log('OUTLINE');
    log('OUTLINE');
    log('OUTLINE');
    fillOutline(tpAgent, calcFirstX, intY1, calcFirstZ, calcLastX, intY2, calcLastZ, fillString, fillMode);
  } else {
    fillReplace(tpAgent, calcFirstX, intY1, calcFirstZ, calcLastX, intY2, calcLastZ, fillString, fillMode);
  }
}

function fillReplace(tpAgent, x1, y1, z1, x2, y2, z2, fillString, fillMode) {
  let delayIterator = 1;

  for (let currX = x1; currX <= x2; currX++) {
    for (let currZ = z1; currZ <= z2; currZ++) {
      setBlocks(tpAgent, currX, currZ, y1, y2, fillString, delayIterator);
      delayIterator += delayIncrements;
    }
  }
}

function fillOutline(tpAgent, x1, y1, z1, x2, y2, z2, fillString, fillMode) {
  let delayIterator = 1;

  for (let currX = x1; currX <= x2; currX++) {
    for (let currZ = z1; currZ <= z2; currZ++) {
      if (currX === x1 || currX === x2 || currZ === z1 || currZ === z2) {
        setBlocks(tpAgent, currX, currZ, y1, y2, fillString, delayIterator);
        delayIterator += delayIncrements;
      } else {
        if (fillMode === 'outline-walls') { continue; }
        setBlocks(tpAgent, currX, currZ, y1, y1, fillString, delayIterator);
        setBlocks(tpAgent, currX, currZ, y2, y2, fillString, delayIterator, false);
        delayIterator += delayIncrements;
      }
    }
  }
}


function setBlocks(tpAgent, x, z, y1, y2, fillString, delayIterator, shouldTp = true) {
  delay.createRapid(delayIterator + 3, () => {
    commands.cmd(`fill ${x} ${y1} ${z} ${x} ${y2} ${z} ${fillString}`)
  });

  if (shouldTp) {
    delay.createRapid(delayIterator, () => {
      commands.cmd(`tp ${tpAgent} ${x} 256 ${z}`);
    });
  }
}


const int = val => parseInt(val, 10);


export default {
  fill,
}
