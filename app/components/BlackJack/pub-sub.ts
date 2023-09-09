import Emittery from 'emittery';
import {isClientDevMode} from "@/utils/env";

export const BlackJackPubSub = new Emittery();

export enum BlackJackPubSubEvent {
  AnimateCard = 'AnimateCard',
}

if (isClientDevMode) {
  // @ts-ignore Mount to window for debugging
  window.tmp__BlackJackPubSub = BlackJackPubSub
}
