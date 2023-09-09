import Image from 'next/image'
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ImgBlackPink from '@/assets/img/blackpink.png'
import ImgBlackJack from '@/assets/img/blackjack-bg.jpg'
import {Hand} from "./Hand";
import {CardDeck} from "./CardDeck";
import {Player} from "./model";
import {CardVariant as V} from "@/components/BlackJack/Hand/Card/model";
import {PlayerActions} from "@/components/BlackJack/PlayerActions";


export default function BlackJack() {
  const players: Player[] = [
    {
      name: "BlackPink (Dealer)",
      user_id: "ertyhjk",
      hand: {
        cards: [
          // dealer card 0 will show backface at start
          {face: "A", variant: V.Spade, value: 1, value2: 11, deck: 0, backFace: true},
          {face: "J", variant: V.Diamond, value: 10, deck: 0},
        ]
      }
    },
    {
      name: "Suzi",
      user_id: "awfnlk",
      hand: {
        cards: [
          {face: "10", variant: V.Club, value: 10, deck: 0},
          {face: "6", variant: V.Heart, value: 16, deck: 0},
        ]
      }
    },
  ]

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
        <Box sx={{m: 0}} style={{ position: "relative", zIndex: 0, overflow: "hidden", paddingBottom: 30}}>
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
            {players.map(i => (
              <Hand key={i.user_id} player={i} cards={i.hand.cards}/>
            ))}
          </Box>

          <Box style={{position: "absolute", top: 0, right: 0,}}>
            <CardDeck/>
          </Box>
        </Box>

        {/* Player actions */}
        <PlayerActions/>
      </Paper>

      <Paper sx={{p: 3, my: 3}} variant="outlined">
        <Typography variant="h5">
          Histories
        </Typography>
      </Paper>
    </>
  )
}
