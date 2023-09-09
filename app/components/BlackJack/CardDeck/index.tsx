import Image from "next/image";
import Typography from "@mui/material/Typography";

import {CardBack} from '../Hand/Card'
import {styled} from "@mui/system";

export const CardDeckWrapper = styled('div')({
  padding: 30,
});

export function CardDeck() {
  return (
    <CardDeckWrapper>
      <CardBack/>
      <Typography align="center" sx={{mt:1}}>
        Decks
      </Typography>
      <Typography align="center">
        -- cards left
      </Typography>
    </CardDeckWrapper>

  )
}
