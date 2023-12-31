import {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from 'react-toastify';
import moment from 'moment';
import {throttle} from "throttle-debounce";

import {GameMatch, MatchStatus} from "@/components/BlackJack/model";
import {get, patch, post} from "@/services/AppApi";
import {Card, CardVariant} from "@/components/BlackJack/Hand/Card/model";
import {CARD_ANIM_TIME, CARD_HIDE_DELAY_MS} from "@/components/BlackJack/CardDeck/CardBackTranslate";
import {BlackJackPubSub, BlackJackPubSubEvent} from "@/components/BlackJack/pub-sub";
import {Hand as HandBackend} from './Hand/debug/Hand'
import {sleep} from "@/utils/time";
import {isClientDevMode} from "@/utils/env";

export const DEALER_USER_ID = "DEALER"

// there is only 1 writer at a time to this:
const PlayerAction = {
  animating: false,
  hittingOrStaying: false,
}

type Callback = any;
export function useMatch(): {
  match: GameMatch | undefined,

  createNewMatch: Callback,
  hit: Callback,
  stay: Callback,

  allowHit: boolean,
  allowStay: boolean,
  allowCreate: boolean,
} {
  // ----- match state ---
  const [match, setMatch] = useState<GameMatch | undefined>(undefined)
  const matchStatus = useMemo(() => match?.status, [match])
  // ----- end match state ---


  const [allowHit, setAllowHit] = useState(true)
  const [allowStay, setAllowStay] = useState(true)
  const [allowCreate, setAllowCreate] = useState(true)


  const onMatchEnd = useCallback((match: GameMatch) => {
    console.log('{onMatchEnd} : ', );
    if (matchStatus !== MatchStatus.Completed) return;

    // anim the rest card to the dealer => was handled right after calling api

    // show the result to the user
    const dealerHand = HandBackend.from(match.dealerHand)
    const playerHand = HandBackend.from(match.playerHand)

    toast.dismiss() // close all prev toast
    toast(
      `[${match.playerHand.status}] `
      + `Dealer (${dealerHand.point} points), You (${playerHand.point} points) | `
      + `at ${moment().format("HH:mm:ss")}`,
      { autoClose: false },
    )
  }, [matchStatus]);

  const debugAddCard = useCallback(async (handIdx: number) => {
    for (let i = 1; i <= 10; i++) {
      const card: Card = {face: "" + i, variant: CardVariant.Heart, value: i, deck: Math.floor(1e6*Math.random())}

      console.log(`${i} => ${i%2 ? 'Player' : 'Dealer'}`);
      await animateAddCardToPlayerHand(i % 2, card, match, setMatch)
      await sleep(2000);
    }

  }, [match, setMatch])
  if (isClientDevMode) {
    // @ts-ignore for debug
    window.tmp__debugAddCard = debugAddCard;
  }

  const hit = useCallback(async () => {
    if (match?.status !== MatchStatus.PlayersTurn) {
      console.error("TODO: notice user that ...")
      return
    }

    if (PlayerAction.animating || PlayerAction.hittingOrStaying) {
      console.log("Skip")
      return
    }

    PlayerAction.hittingOrStaying = true;
    playerHit(match.id).then(async (r) => {
      // update player card
      if (!r) {
        console.error("Cannot get hit info")
        PlayerAction.hittingOrStaying = false
        return
      }

      if (!!r.error) {
        PlayerAction.hittingOrStaying = false;
        return;
      }

      if (r.status === MatchStatus.Completed) {
        // tmp disable button while anim
        setAllowHit(false)
        setAllowStay(false)
      }

      // visual: animate new card to user deck
      await addCardsWithAnimation(1, r, match, setMatch)
      if (r.status === MatchStatus.Completed) {
        // visual: animate new card to user deck
        await addCardsWithAnimation(0, r, match, setMatch)
      }
      if (r.status === MatchStatus.Completed) {
        // turn back
        setAllowHit(true)
        setAllowStay(true)
        await sleep(50)
      }

      // update state to reflect the UI after card animation done
      setMatch(r)

      // NOTE: Must ensure this was always been reached, or plz try/catch the above block
      PlayerAction.hittingOrStaying = false;
    })
  }, [match]);

  const stay = useCallback(async () => {
    if (match?.status !== MatchStatus.PlayersTurn) {
      console.error("TODO: notice user that ...")
      return
    }
    if (PlayerAction.animating || PlayerAction.hittingOrStaying) {
      console.log("Skip")
      return
    }

    PlayerAction.hittingOrStaying = true
    playerStay(match.id).then(async (r) => {
      if (!r) {
        console.error("Cannot get stay info")
        PlayerAction.hittingOrStaying = false
        return
      }

      if (!!r.error) {
        PlayerAction.hittingOrStaying = false
        return
      }

      // visual: animate new card to user deck
      if (r.status === MatchStatus.Completed) {
        // tmp disable hit/stay button
        setAllowHit(false)
        setAllowStay(false)

        // visual: animate new card to user deck
        await addCardsWithAnimation(0, r, match, setMatch)

        // turn back
        setAllowHit(true)
        setAllowStay(true)
        await sleep(50)
      }

      // update state to reflect the UI after card animation done
      setMatch(r)

      PlayerAction.hittingOrStaying = false
    })
  }, [match]);


  const createNewMatch = useCallback(async () => {
    toast.dismiss() // hide all msg on new match
    playerCreateMatch().then((r) => {
      if (!r) {
        console.error("Cannot playerCreateMatch")
      } else {
        setMatch(r)
      }
    })
  }, []);



  useEffect(() => {
    if (!!match?.error) {
      console.error("TODO: Show error", match?.error)
      // this is unexpected error, do not show to user
    }
  }, [match])

  // handle match status
  useEffect(() => {
    // console.log('{useEffect} matchStatus: ', matchStatus);

    // allow hit & stay when match is hit
    if (matchStatus === MatchStatus.PlayersTurn) {
      setAllowHit(true)
      setAllowStay(true)
    } else {
      setAllowHit(false)
      setAllowStay(false)
    }
    if (matchStatus === MatchStatus.Completed) {
      setAllowCreate(true)
    } else {
      setAllowCreate(false)
    }

    // handle match end
    if (matchStatus === MatchStatus.Completed) {
      // ensure that this run only once, because match completed only once
      match && onMatchEnd(match)
    }
  }, [
    match, onMatchEnd,
  ])


  useEffect(() => {
    fetchUserLastMatch().then((r) => {
      if (!r) {
        console.error("Cannot fetchUserLastMatch")
      } else {
        setMatch(r)
      }
    })
  }, [])

  return {
    match,

    createNewMatch,

    // allow triggering hit & stay with 1 rps rate
    hit: throttle(1000, hit, {noTrailing: true}),
    stay: throttle(1000, stay, {noTrailing: true}),

    allowHit,
    allowStay,
    allowCreate,
  }
}


async function fetchUserLastMatch(): Promise<GameMatch | undefined> {
  const r = await get('/api/v1/blackjack/last-match');
  console.log('{fetchUserLastMatch} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}

async function playerCreateMatch(): Promise<GameMatch | undefined> {
  const r = await post('/api/v1/blackjack/new-match');
  console.log('{playerCreateMatch} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}

async function playerHit(matchId: string): Promise<GameMatch | undefined> {
  const r = await patch(`/api/v1/blackjack/match/${matchId}/hit`);
  console.log('{playerHit} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}

async function playerStay(matchId: string): Promise<GameMatch | undefined> {
  const r = await patch(`/api/v1/blackjack/match/${matchId}/stay`);
  console.log('{playerStay} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}


async function addCardsWithAnimation(
  handIdx: number,
  newMatch: GameMatch | undefined,
  oldMatch: GameMatch | undefined,
  setMatch: any,
) {
  PlayerAction.animating = true; // lock
  // player often add 1 cards
  // dealer often add multiple cards
  let [oldCards, newCards] = handIdx == 0
    ? [oldMatch?.dealerHand?.cards, newMatch?.dealerHand?.cards]
    : [oldMatch?.playerHand?.cards, newMatch?.playerHand?.cards]

  if (!oldCards) oldCards = [];
  if (!newCards) newCards = [];

  try {
    for (let i = oldCards.length; i < newCards.length; i++) {
      const card = newCards[i]
      await animateAddCardToPlayerHand(handIdx, card, oldMatch, setMatch)
      await sleep(600); // sleep every time added a card
    }
  } catch (e) {
    console.log('{addCardsWithAnimation} e: ', e);
  }
  PlayerAction.animating = false;// release lock
}

// also control the timeline + UI
// need to custom anim curve
// @params handIdx: the index in hands arr, 0 mean dealer, 1 mean player
async function animateAddCardToPlayerHand(
  handIdx: number,
  newCard: Card,
  oldMatch: GameMatch | undefined,
  setMatch: any,
) {
  return new Promise(resolve => {
    // animate for a duration
    BlackJackPubSub.emit('AnimateCard', handIdx)
    // if (oldMatch) {
    //   const newCardIdx = ((handIdx === 0)
    //       ? oldMatch.dealerHand
    //       : oldMatch.playerHand
    //   ).cards.length;
    //   BlackJackPubSub.emit(BlackJackPubSubEvent.AnimateMultiCard, {handIdx, cardIdx: newCardIdx})
    // }

    // need to show up card before transition end 100ms
    setTimeout(() => {
      if (!oldMatch) {
        console.error("Skip anim when empty oldMatch", newCard, oldMatch)
        resolve(false)
      } else {
        ((handIdx === 0)
            ? oldMatch.dealerHand
            : oldMatch.playerHand
        ).cards.push(newCard)
        setMatch({...oldMatch})
        resolve(true)
      }
    }, CARD_ANIM_TIME * 1000 - 50)
  })
}
