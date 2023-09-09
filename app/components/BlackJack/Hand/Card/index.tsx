import React, {forwardRef} from 'react';
import {styled} from '@mui/system';
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Box from "@mui/material/Box";

import ImgCardBg from "@/assets/img/card-front.png";
import ImgCardBackBg from "@/assets/img/card-back.webp";
import {CardVariant, Card} from './model'

const CardWrapper = styled('div')({
  color: "grey",
  backgroundColor: 'aliceblue',
  padding: 10,
  borderRadius: 8,
  border: "1px solid #a00",
  width: 125,
  height: 175,
});

type Props = {
  card: Card,
}

export function Card(props: Props) {
  const {card} = props;
  const [varUi, color] = cardStyle(card)

  return card.backFace
    ? <CardBack />
    : (
      <CardWrapper>
        <Typography color={color} fontSize={24}>{card.face}</Typography>
        <Typography color={color} fontSize={26} lineHeight={0.5}>
          {varUi}
        </Typography>
        <Box textAlign="center">
          <Image
            src={ImgCardBg} alt="table"
            width={60} height={60}
            style={{width: "100%", height: "auto"}}
          />
        </Box>
      </CardWrapper>
    )
}

// eslint-disable-next-line react/display-name
// export const CardBack = forwardRef((props: React.ComponentProps<any>, ref: any) => {
export function CardBack() {
  return (
    <CardWrapper
      // ref={ref}
      style={{border: "none", padding: 0}}
    >
      <Image
        src={ImgCardBackBg} alt="table"
        width={125} height={175}
      />
    </CardWrapper>
  )
}
// )

function cardStyle(card: Card): string[] {
  switch (card.variant) {
    case CardVariant.Spade:
      return ['♠', 'black']
    case CardVariant.Club:
      return ['♣', 'black']
    case CardVariant.Diamond:
      return ['♦', 'red']
    case CardVariant.Heart:
      return ['♥', 'red']
    default:
      return ['?', 'black']
  }
}
