import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {CardUI} from "./Card";
import {Card} from "./Card/model";
import {Player} from "../model";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/system";
import {NonReactiveData} from "@/components/BlackJack/non-reactive-data";

const HandWrapper = styled('div')({
  padding: "10px 20px",
  marginTop: 20,
});

type Props = {
  handIdx: number, // the index of hand, count from 0 to n, 0 is dealer's hand
  player: Player,
  cards: Card[],
}

export function Hand(props: Props) {
  const {cards, player, handIdx} = props;

  return (
    <HandWrapper>
      <Typography variant="h6">
        {player.name}
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
    </HandWrapper>
  )
}
