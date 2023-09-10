import {useCallback, useEffect, useState} from "react";
import {GameMatch, GameMatchMeta, MatchStatus, Player} from "@/components/BlackJack/model";
import {get, patch} from "@/services/AppApi";
import {Card} from "@/components/BlackJack/Hand/Card/model";
import {CARD_ANIM_TIME, CARD_HIDE_TIME_OFFSET} from "@/components/BlackJack/CardDeck/CardBackTranslate";
import {BlackJackPubSub} from "@/components/BlackJack/pub-sub";

const DEALER_USER_ID = "DEALER"

type Callback = any;
export function useMatch(): {
  players: (Player|undefined)[],
  createNewMatch: Callback,
  hit: Callback,
  stay: Callback,
} {
  const [dealer, setDealer] = useState<Player | undefined>(undefined)
  const [player, setPlayer] = useState<Player | undefined>(undefined)

  // GameMatchMeta contain info often change together
  const [matchStatus, setMatchStatus] = useState(MatchStatus.PlayersTurn)
  const [matchStopAt, setMatchStopAt] = useState(0)
  const [matchError, setMatchError] = useState("")

  const createNewMatch = useCallback(async () => {}, []);

  const onMatchEnd = useCallback(() => {
    console.log('{onMatchEnd} : ', );
    // TODO
    // show the result to the user
    // count down delay for new match
  }, [setPlayer]);

  const hit = useCallback(async () => {
    if (matchStatus !== MatchStatus.PlayersTurn) {
      console.error("TODO: notice user that ...")
      return
    }

    playerHit().then(r => {
      // update player card
      if (!r) {
        console.error("Cannot get hit info")
        return
      }

      setMatchStatus(r.status)
      setMatchStopAt(r.stopAt)
      setMatchError(r.error ?? '')

      if (r.error) return;

      // visual: animate new card to user deck
      animateAddCardToPlayerHand(r.playerHand.cards, player!, setPlayer)
    })
  }, [setPlayer]);

  const stay = useCallback(async () => {
    if (matchStatus !== MatchStatus.PlayersTurn) {
      console.error("TODO: notice user that ...")
      return
    }

    playerStay().then(r => {
      if (!r) {
        console.error("Cannot get stay info")
        return
      }

      setMatchStatus(r.status)
      setMatchStopAt(r.stopAt)
      setMatchError(r.error ?? '')
    })
  }, [setPlayer]);


  // handle match status
  useEffect(() => {
    if (!!matchError) {
      console.error("TODO: Show error", matchError)
    }

    // handle match end
    if (matchStatus === MatchStatus.Completed) {
      onMatchEnd()
    }
  }, [matchError, matchStatus, onMatchEnd])


  useEffect(() => {
    fetchUserLastMatch().then((r) => {
      if (!r) {
        console.error("Cannot fetchUserLastMatch")
      } else {
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
      }
    })
  }, [
    setDealer, setPlayer,
    setMatchStatus,
    setMatchStopAt,
    setMatchError,
  ])

  return {
    players: [dealer, player],
    createNewMatch,
    hit,
    stay,
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


// also control the timeline + UI
// need to custom anim curve
function animateAddCardToPlayerHand(newCards: Card[], player: Player, setPlayer: any) {
  // animate for a duration
  const playerHandIdx = 1
  BlackJackPubSub.emit('AnimateCard', playerHandIdx)

  // need to show up card before transition end 100ms
  setTimeout(() => {
    player.hand.cards = newCards
    setPlayer({...player})
  }, CARD_ANIM_TIME + CARD_HIDE_TIME_OFFSET - 50)
}
