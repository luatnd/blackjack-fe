import {useCallback, useEffect, useState} from "react";
import {GameMatch, Player} from "@/components/BlackJack/model";
import {get} from "@/services/AppApi";

const DEALER_USER_ID = "DEALER"

type Callback = any;
export function useMatch(): {
  players: (Player|undefined)[],
  createNewMatch: Callback,
  hit: Callback,
  stay: Callback,
} {
  // const players = [
  //   {
  //     name: "BlackPink (Dealer)",
  //     user_id: "ertyhjk",
  //     hand: {
  //       cards: [
  //         // dealer card 0 will show backface at start
  //         {face: "A", variant: V.Spade, value: 1, value2: 11, deck: 0, backFace: true},
  //         {face: "J", variant: V.Diamond, value: 10, deck: 0},
  //       ]
  //     }
  //   },
  //   {
  //     name: "Suzi",
  //     user_id: "awfnlk",
  //     hand: {
  //       cards: [
  //         {face: "10", variant: V.Club, value: 10, deck: 0},
  //         {face: "6", variant: V.Heart, value: 16, deck: 0},
  //       ]
  //     }
  //   },
  // ]

  const [dealer, setDealer] = useState<Player | undefined>(undefined)
  const [player, setPlayer] = useState<Player | undefined>(undefined)

  const createNewMatch = useCallback(() => {}, []);
  const hit = useCallback(() => {}, []);
  const stay = useCallback(() => {}, []);
  // TODO


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
      }
    })
  }, [setDealer, setPlayer])

  return {
    players: [dealer, player],
    createNewMatch: () => {},
    hit: () => {},
    stay: () => {},
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
