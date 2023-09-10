import {useCallback, useEffect, useState} from "react";
import {toast} from 'react-toastify';

import {GameMatch, MatchStatus, Player} from "@/components/BlackJack/model";
import {get, patch, post} from "@/services/AppApi";
import {Card} from "@/components/BlackJack/Hand/Card/model";
import {CARD_ANIM_TIME, CARD_HIDE_TIME_OFFSET} from "@/components/BlackJack/CardDeck/CardBackTranslate";
import {BlackJackPubSub} from "@/components/BlackJack/pub-sub";
import {Hand as HandBackend} from './Hand/debug/Hand'

const DEALER_USER_ID = "DEALER"

type Callback = any;
export function useMatch(): {
  players: (Player|undefined)[],
  createNewMatch: Callback,
  hit: Callback,
  stay: Callback,

  delay: number,

  allowHit: boolean,
  allowStay: boolean,
  allowCreate: boolean,
} {
  // ----- match state ---
  const [dealer, setDealer] = useState<Player | undefined>(undefined)
  const [player, setPlayer] = useState<Player | undefined>(undefined)
  const [matchStatus, setMatchStatus] = useState(MatchStatus.PlayersTurn)
  const [matchStopAt, setMatchStopAt] = useState(0)
  const [matchError, setMatchError] = useState("")
  const [delay, setDelay] = useState(0)
  // ----- end match state ---


  const [allowHit, setAllowHit] = useState(true)
  const [allowStay, setAllowStay] = useState(true)
  const [allowCreate, setAllowCreate] = useState(true)


  const onMatchEnd = useCallback(() => {
    console.log('{onMatchEnd} : ', );

    // anim the rest card to the dealer => was handled right after calling api

    // show the result to the user
    if (!dealer || !player) {
      console.error("This should not happen: dealer/player empty on match end: ", dealer, player)
    } else {
      const dealerHand = HandBackend.from(dealer.hand)
      const playerHand = HandBackend.from(player.hand)
      toast(
        `[${player.hand.status}] Dealer (${dealerHand.point} points), You (${playerHand.point} points)`,
        { autoClose: false },
      )
    }

    // count down delay for new match
    // TODO:
  }, [dealer, player]); // no dependency

  const hit = useCallback(async () => {
    if (matchStatus !== MatchStatus.PlayersTurn) {
      console.error("TODO: notice user that ...")
      return
    }

    playerHit().then(async (r) => {
      // update player card
      if (!r) {
        console.error("Cannot get hit info")
        return
      }

      if (!!r.error) return;
      if (!player) {
        console.error("Skip to add card because of empty player")
        return
      }

      // visual: animate new card to user deck
      await addCardsWithAnimation(1, player.hand.cards, r.playerHand.cards, player, setPlayer)
      if (r.status === MatchStatus.Completed) {
        if (!dealer) {
          console.error("Skip to add card because of empty player")
          return
        }
        // visual: animate new card to user deck
        await addCardsWithAnimation(0, dealer.hand.cards, r.dealerHand.cards, dealer, setDealer)
      }

      // update state to reflect the UI after card animation done
      setMatch(
        r,
        setDealer,
        setPlayer,
        setMatchStatus,
        setMatchStopAt,
        setMatchError,
        setDelay,
      )
    })
  }, [player, setPlayer, dealer, setDealer, setMatchStatus, setMatchStopAt, setMatchError, setDelay]);

  const stay = useCallback(async () => {
    if (matchStatus !== MatchStatus.PlayersTurn) {
      console.error("TODO: notice user that ...")
      return
    }

    playerStay().then(async (r) => {
      if (!r) {
        console.error("Cannot get stay info")
        return
      }

      if (!!r.error) return;
      // visual: animate new card to user deck
      if (r.status === MatchStatus.Completed) {
        if (!dealer) {
          console.error("Skip to add card because of empty player")
          return
        }
        // visual: animate new card to user deck
        await addCardsWithAnimation(0, dealer.hand.cards, r.dealerHand.cards, dealer, setDealer)
      }

      // update state to reflect the UI after card animation done
      setMatch(
        r,
        setDealer,
        setPlayer,
        setMatchStatus,
        setMatchStopAt,
        setMatchError,
        setDelay,
      )
    })
  }, [player, setPlayer, dealer, setDealer, setMatchStatus, setMatchStopAt, setMatchError, setDelay]);


  const createNewMatch = useCallback(async () => {
    playerCreateMatch().then((r) => {
      if (!r) {
        console.error("Cannot playerCreateMatch")
      } else {
        setMatch(
          r,
          setDealer,
          setPlayer,
          setMatchStatus,
          setMatchStopAt,
          setMatchError,
          setDelay,
        )
      }
    })
  }, [
    setDealer,
    setPlayer,
    setMatchStatus,
    setMatchStopAt,
    setMatchError,
    setDelay,
  ]);



  useEffect(() => {
    if (!!matchError) {
      console.error("TODO: Show error", matchError)
      // this is unexpected error, do not show to user
    }
  }, [matchError])

  // handle match status
  useEffect(() => {
    console.log('{useEffect} matchStatus: ', matchStatus);

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
      onMatchEnd()
    }
  }, [
    matchStatus, onMatchEnd,
    setAllowHit, setAllowStay, setAllowCreate,
  ])


  useEffect(() => {
    fetchUserLastMatch().then((r) => {
      if (!r) {
        console.error("Cannot fetchUserLastMatch")
      } else {
        setMatch(
          r,
          setDealer,
          setPlayer,
          setMatchStatus,
          setMatchStopAt,
          setMatchError,
          setDelay,
        )
      }
    })
  }, [
    setDealer, setPlayer,
    setMatchStatus,
    setMatchStopAt,
    setMatchError,
    setDelay,
  ])

  return {
    players: [dealer, player],
    createNewMatch,
    hit,
    stay,

    delay,

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
  console.log('{fetchUserLastMatch} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}

async function playerHit(): Promise<GameMatch | undefined> {
  const r = await patch('/api/v1/blackjack/hit');
  console.log('{playerHit} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}

async function playerStay(): Promise<GameMatch | undefined> {
  const r = await patch('/api/v1/blackjack/stay');
  console.log('{playerStay} r: ', r);
  if (!r.ok) {
    return undefined
  }

  return r.body
}


function setMatch(
  r: GameMatch,
  setDealer: any,
  setPlayer: any,
  setMatchStatus: any,
  setMatchStopAt: any,
  setMatchError: any,
  setDelay: any,
) {
  const dealer = {
    name: "BlackPink (Dealer)",
    user_id: DEALER_USER_ID,
    hand: r.dealerHand,
  }
  const player = {
    name: r.player.name,
    user_id: r.player.id,
    hand: r.playerHand,
  }
  setDealer(dealer)
  setPlayer(player)
  setMatchStatus(r.status)
  setMatchStopAt(r.stopAt)
  setMatchError(r.error ?? '')
  setDelay(r.delay)
}


async function addCardsWithAnimation(handIdx: number, oldCards: Card[], newCards: Card[], player: Player | undefined, setPlayer: any) {
  // player often add 1 cards
  // dealer often add multiple cards
  for (let i = oldCards.length; i < newCards.length; i++) {
    const card = newCards[i]
    await animateAddCardToPlayerHand(handIdx, card, player, setPlayer)
  }
}

// also control the timeline + UI
// need to custom anim curve
// @params handIdx: the index in hands arr, 0 mean dealer, 1 mean player
async function animateAddCardToPlayerHand(handIdx: number, newCard: Card, player: Player | undefined, setPlayer: any) {
  return new Promise(resolve => {
    // animate for a duration
    BlackJackPubSub.emit('AnimateCard', handIdx)

    // need to show up card before transition end 100ms
    setTimeout(() => {
      if (!player) {
        console.error("Skip anim when empty player", newCard, player)
        resolve(false)
      } else {
        player.hand.cards.push(newCard)
        setPlayer({...player})
        resolve(true)
      }
    }, CARD_ANIM_TIME + CARD_HIDE_TIME_OFFSET - 50)
  })
}

// TODO: handle anim to dealer cards
const mockBodyDraw = {
  "dealerHand": {
    "playerId": "DEALER",
    "handIdx": 0,
    "cards": [
      {
        "deck": 0,
        "face": "6",
        "variant": 2,
        "value": 6
      },
      {
        "deck": 5,
        "face": "5",
        "variant": 0,
        "value": 5
      },
      {
        "deck": 4,
        "face": "K",
        "variant": 1,
        "value": 10
      }
    ],
    "status": "BlackJack"
  },
  "playerHand": {
    "playerId": "6",
    "handIdx": 1,
    "cards": [
      {
        "deck": 5,
        "face": "3",
        "variant": 0,
        "value": 3
      },
      {
        "deck": 5,
        "face": "7",
        "variant": 2,
        "value": 7
      },
      {
        "deck": 4,
        "face": "K",
        "variant": 3,
        "value": 10
      },
      {
        "deck": 5,
        "face": "1",
        "variant": 2,
        "value": 1
      }
    ],
    "status": "Draw"
  },
  "player": {
    "name": "u1",
    "id": "6"
  },
  "status": 2,
  "stopAt": 1694333396241,
  "error": ""
}
