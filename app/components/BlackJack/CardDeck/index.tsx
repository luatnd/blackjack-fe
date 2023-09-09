import Typography from "@mui/material/Typography";
import {styled} from "@mui/system";

import {CardBack} from '../Hand/Card'
import CardBackTranslate from './CardBackTranslate'


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

      <CardBackTranslate/>
    </CardDeckWrapper>

  )
}
