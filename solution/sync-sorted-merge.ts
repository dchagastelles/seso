"use strict";

import AVLTree from 'avl';
import { LinkedList, LogValue } from "../lib/linkedlist";
import LogSource  from "../lib/log-source";

// Print all entries, across all of the sources, in chronological order.




module.exports = (logSources, printer) => {

    function comparator(a: LogValue, b: LogValue) {
    if (a.date < b.date) return -1;
  
    if (a.date > b.date) return 1;
  
    return 0;
  }

  const tree = new AVLTree(comparator);

  for (let i = 0; i < logSources.length; i++) {
    let logSource = logSources[i];
    let poppedValue = logSource?.pop();

    if (typeof(poppedValue) === "boolean"){
      // do nothing
    } else {
      poppedValue.source = logSource;
      tree.insert(poppedValue);

    }
  } 

  while (tree.size > 0) {
    let minNodeValue = tree.pop().key as LogValue;
    printer.print(minNodeValue);



    let logSource = minNodeValue.source as LogSource;
    
    if (!logSource?.drained){
      let poppedLog = logSource?.pop();


      if (poppedLog !== false && poppedLog !== undefined){
        poppedLog.source = logSource;
        tree.insert(poppedLog);
      } else {
        //console.log(`Drainned LogSource}`);

      }
    } else {
      //console.log(`Drainned LogSource`);
    }
  }
  printer.done();
  return console.log("Sync sort complete.");

  
}

