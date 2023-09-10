import Image from 'next/image'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import ImgBlackPink from '@/assets/img/blackpink.png'
import ImgBlackJack from '@/assets/img/blackjack-bg.jpg'
import {Hand} from "./Hand";
import {CardDeck} from "./CardDeck";
import {PlayerActions} from "@/components/BlackJack/PlayerActions";
import {DEALER_USER_ID, useMatch} from "@/components/BlackJack/service";
import {useMemo} from "react";
import {Player} from "@/components/BlackJack/model";


export default function BlackJack() {
  const {
    match,
    createNewMatch,
    hit,
    stay,
    allowHit,
    allowStay,
    allowCreate,
  } = useMatch()


  const players: Player[] = useMemo(() => {
    if (!match) return []

    const dealer = {
      name: "BlackPink (Dealer)",
      user_id: DEALER_USER_ID,
      hand: match.dealerHand,
    }
    const player = {
      name: match.player.name,
      user_id: match.player.id,
      hand: match.playerHand,
    }

    return [dealer, player]
  }, [match?.dealerHand, match?.playerHand])

  // console.log('{BlackJack:render} match: ', match);

  return (
    <>
      <Paper elevation={0} variant="outlined" sx={{my: 3, p: 3}}>
        {/* Dealer avatar */}
        <Box textAlign="center">
          <Image
            src={ImgBlackPink} alt="Dealer"
            width={200} height={200} style={{width: "auto"}}
          />
        </Box>

        {/* Casino Table */}
        <Box
          sx={{m: 0}}
          style={{ position: "relative", zIndex: 0, overflow: "hidden", paddingBottom: 30, minHeight: 400}}
        >
          <Image
            src={ImgBlackJack} alt="table"
            width={200} height={200}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: -1,
              borderRadius: 30,
            }}
          />

          <Box>
            {players.map((i, idx) => {
              if (!i) return null
              // 1 player has 1 hand for this UI
              return <Hand hand={i.hand} playerName={i.name} key={`${i.user_id}_${i.hand.handIdx}`} />
            })}
          </Box>

          <Box style={{position: "absolute", top: 0, right: 0,}}>
            <CardDeck/>
          </Box>
        </Box>

        {/* Player actions */}
        <PlayerActions
          hit={hit} allowHit={allowHit}
          stay={stay} allowStay={allowStay}
          createNewMatch={createNewMatch} allowCreate={allowCreate}
          delay={match?.delay ?? 0}
        />
      </Paper>

      <Paper sx={{p: 3, my: 3}} variant="outlined">
        <Typography variant="h5">
          Histories <small>(of this session)</small>
        </Typography>
      </Paper>

      <ToastContainer
        autoClose={90000}
      />
    </>
  )
}
