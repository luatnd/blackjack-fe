// NOTE: this support only 2 hands, dealer, and players.
import {NonReactiveData} from "@/components/BlackJack/non-reactive-data";
import {getElPosRelativeToViewPort} from "@/utils/DOM";

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

  const CARD_SPACING = 40; // each card start different 40px
  // dx = pos of last card - pos of current deck => get it from mobx
  // delta = 0  mean no move
  let dx = handPos.left - deckPos.left + CARD_SPACING,
    dy = handPos.top - deckPos.top

  return {x: dx, y: dy}
}
