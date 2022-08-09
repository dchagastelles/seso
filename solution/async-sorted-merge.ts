"use strict";

import AVLTree from "avl";
import { LinkedList, LogValue } from "../lib/linkedlist";
import LogSource from "../lib/log-source";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    
    async function popAndSet(logSource: LogSource) : Promise<LogValue> {
      let logValue = await logSource.popAsync();
      logValue.source = logSource;
      return logValue;
    }

    async function initTreeConcurrently() : Promise<void> {
      let promises: Promise<LogValue>[] = [];
      for (let i = 0; i < logSources.length; i++) {
        let logSource = logSources[i];
        let poppedValuePromise = popAndSet(logSource) ;

        promises.push(poppedValuePromise);
      } 

      // await on all promises concurrently
      let startingLogs = await Promise.all(promises);
      tree.load(startingLogs, undefined, true);
    }

    async function initTreeSequentially() : Promise<void> {
      for (let i = 0; i < logSources.length; i++) {
        let logSource = logSources[i];
        let poppedValue = await logSource?.popAsync();
      
        if (typeof(poppedValue) === "boolean"){
            // do nothing
          } else {
              poppedValue.source = logSource;
              tree.insert(poppedValue);
          }
      } 
    }

    
    function comparator(a: LogValue, b: LogValue) {
      if (a.date < b.date) return -1;
    
      if (a.date > b.date) return 1;
    
      return 0;
    }
  
    let startTime = new Date();
    const tree = new AVLTree(comparator);

    // using 
    await initTreeConcurrently();

    // instead of the much slower
    //await initTreeSequentially();
          
    var timeTaken = ((new Date()).getTime() - startTime.getTime()) / 1000;
    console.log(`Tree initializationTime in seconds ${timeTaken}`);
          
    while (tree.size > 0) {
      let minNodeValue = tree.pop().key as LogValue;
      printer.print(minNodeValue);
      
      //console.error(`********************* ${tree.size}` );
  
      let logSource = minNodeValue.source as LogSource;
      
      if (!logSource?.drained){
        let poppedLog = await logSource?.popAsync();
        
        
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
    return console.log("Async sort complete.");
  });
};
