// NOTE: this support only 2 hands, dealer, and players.
import {NonReactiveData} from "@/components/BlackJack/non-reactive-data";
import {getElPosRelativeToViewPort} from "@/utils/DOM";


// TODO: Responsive In mobile, it's 24
export const CARD_SPACING = 45; // each card start different 40px
/**
 * Get dx, dy of translation in Oxy coordinate
 * Relative to the last card of hands
 */
export function getTargetHandTranslation(handIdx: number): {x: number, y: number} {
  if (!NonReactiveData.deckRef) {
    console.error('{getTargetTranslateConfig} invalid deckRef: ', NonReactiveData);
    return {x: 0, y: 0}
  }
  if (NonReactiveData.handRefs.length - 1 < handIdx || !NonReactiveData.handRefs[handIdx]) {
    console.error('{getTargetTranslateConfig} invalid handRef: ', handIdx, NonReactiveData);
    return {x: 0, y: 0}
  }

  const deckPos = getElPosRelativeToViewPort(NonReactiveData.deckRef)
  const handPos = getElPosRelativeToViewPort(NonReactiveData.handRefs[handIdx])

  // dx = pos of last card - pos of current deck => get it from mobx
  // delta = 0  mean no move
  let dx = handPos.left - deckPos.left + CARD_SPACING,
    dy = handPos.top - deckPos.top

  return {x: dx, y: dy}
}

/**
 * Get dx, dy of translation in Oxy coordinate
 * Relative to the first card of hands
 * @deprecated
 */
export function getDeltaTranslationFromFirstCards(handIdx: number): {x: number, y: number} {
  if (!NonReactiveData.deckRef) {
    console.error('{getTargetTranslateConfig} invalid deckRef: ', NonReactiveData);
    return {x: 0, y: 0}
  }
  if (NonReactiveData.handRefs.length - 1 < handIdx || !NonReactiveData.handFirstCardRefs[handIdx]) {
    console.error('{getTargetTranslateConfig} invalid handRef: ', handIdx, NonReactiveData);
    return {x: 0, y: 0}
  }

  const deckPos = getElPosRelativeToViewPort(NonReactiveData.deckRef)
  const handPos = getElPosRelativeToViewPort(NonReactiveData.handFirstCardRefs[handIdx])

  // dx = pos of last card - pos of current deck => get it from mobx
  // delta = 0  mean no move
  let dx = handPos.left - deckPos.left,
    dy = handPos.top - deckPos.top

  return {x: dx, y: dy}
}
