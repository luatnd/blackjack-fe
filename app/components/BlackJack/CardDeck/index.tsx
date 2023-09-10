import Typography from "@mui/material/Typography";
import {styled} from "@mui/system";

import {CardBack} from '../Hand/Card'
import {CardBackTranslateSingle, CardBackTranslateStack} from './CardBackTranslate'
import {NoSsr} from "@mui/material";
import {NonReactiveData} from "@/components/BlackJack/non-reactive-data";


export const CardDeckWrapper = styled('div')({
  padding: 30,
  position: "relative",
});
const AbsoluteCardContainer = styled('div')({
  position: "absolute",
  top: 30, left: 30, // because of above padding
});

export function CardDeck() {
  return (
    <CardDeckWrapper>
      <CardBack/>

      {/* Animation is on client only */}
      <NoSsr>
        <AbsoluteCardContainer className="TransitionCardContainer" ref={r => NonReactiveData.deckRef = r}>
          <CardBackTranslateSingle/>
          {/*<CardBackTranslateStack/>*/}
        </AbsoluteCardContainer>
      </NoSsr>

      <Typography align="center" sx={{mt:1}}>
        Decks
      </Typography>
      <Typography align="center">
        -- cards left
      </Typography>
    </CardDeckWrapper>
  )
}
