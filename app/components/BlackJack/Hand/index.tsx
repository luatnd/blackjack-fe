import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {Card as CardUI} from "./Card";
import {Card} from "./Card/model";
import {Player} from "../model";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/system";

const HandWrapper = styled('div')({
  padding: "10px 20px",
  marginTop: 20,
});

type Props = {
  player: Player,
  cards: Card[],
}

export function Hand(props: Props) {
  const {cards, player} = props;

  return (
    <HandWrapper>
      <Typography variant="h6">
        {player.name}
      </Typography>
      <Stack spacing={-10} direction="row" sx={{mt: 1}}>
        {cards.map((i) => (
          <CardUI key={`${i.face}_${i.variant}_${i.deck}`} card={i} />
        ))}
      </Stack>
    </HandWrapper>
  )
}
