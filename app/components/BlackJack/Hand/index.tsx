import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {CardUI} from "./Card";
import {Card} from "./Card/model";
import {Player} from "../model";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/system";
import {NonReactiveData} from "@/components/BlackJack/non-reactive-data";

import {Hand as HandBackend} from './debug/Hand'
import {HandDto} from "@/components/BlackJack/Hand/model";

const HandWrapper = styled('div')({
  padding: "10px 20px",
  marginTop: 20,
});

type Props = {
  playerName: string,
  hand: HandDto,
}

export function Hand(props: Props) {
  const {hand, playerName} = props;
  const {cards, handIdx} = hand;

  return (
    <HandWrapper>
      <Typography variant="h6">
        {playerName}
      </Typography>
      <Stack spacing={-10} direction="row" sx={{mt: 1}}>
        {cards.map((i, idx) => {
          if (idx == cards.length - 1) {
            // save ref of the last cards
            return <CardUI
              key={`${i.face}_${i.variant}_${i.deck}`} card={i}
              ref={(r: any) => NonReactiveData.handRefs[handIdx] = r}
            />
          }
          return <CardUI key={`${i.face}_${i.variant}_${i.deck}`} card={i} />
        })}
      </Stack>

      <div className="debug-hand">
        <p><b>Debug</b></p>
        <p>{JSON.stringify({
          point: HandBackend.from(hand).point,
        })}</p>
      </div>
    </HandWrapper>
  )
}
