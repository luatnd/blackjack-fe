import React from 'react'
import {isClientDevMode} from "@/utils/env";

// Data sharing without reactive
export const NonReactiveData:  {
  /*
    Need to save elements DOM here for position calculation,
    use for card animation
   */
  // the DOM el of deck
  deckRef: any,
  // the DOM el of the last card of each hand
  handRefs: any[]
} = {
  deckRef: undefined,
  handRefs: [undefined, undefined]
}

if (isClientDevMode) {
  // @ts-ignore Mount to window for debugging
  window.tmp__NonReactiveData = NonReactiveData
}
