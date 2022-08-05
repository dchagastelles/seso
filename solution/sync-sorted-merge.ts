"use strict";

import { LinkedList } from "../lib/linkedlist";
import LogSource  from "../lib/log-source";

// Print all entries, across all of the sources, in chronological order.




module.exports = (logSources, printer) => {

  let linkedList = undefined;
  for (let i = 0; i < logSources.length; i++) {
    let logSource = logSources[i];
    let poppedValue = logSource?.pop();

    if (typeof(poppedValue) === "boolean"){
      // do nothing
    } else {
      poppedValue.source = logSource;
  
      if (linkedList === undefined){
        linkedList = new LinkedList(poppedValue);
      } else {
        linkedList.add(poppedValue);
      }
    }
  } 
    
  
  
  while ((linkedList as LinkedList).length > 0) {

    let minNode = linkedList?.popHead();
    printer.print(minNode?.value);

    let logSource = minNode?.value?.source as LogSource;
    
    if (!logSource?.drained){
      let poppedLog = logSource?.pop();


      if (poppedLog !== false && poppedLog !== undefined){
        poppedLog.source = minNode?.value?.source;
        linkedList?.add(poppedLog);
      } else {
        console.log(`Drainned LogSource}`);

      }
    } else {
      console.log(`Drainned LogSource`);
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};
