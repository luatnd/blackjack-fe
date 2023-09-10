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
import {useMatch} from "@/components/BlackJack/service";


export default function BlackJack() {
  const {
    players,
    createNewMatch,
    hit,
    stay,
    allowHit,
    allowStay,
    allowCreate,
  } = useMatch()


  console.log('{BlackJack:render} players: ', players);

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
