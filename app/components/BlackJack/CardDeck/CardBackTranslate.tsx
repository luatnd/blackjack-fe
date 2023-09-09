import {useCallback, useEffect, useState} from "react";
import {motion} from "framer-motion"
import {CardBack} from "@/components/BlackJack/Hand/Card";
import {isClientDevMode} from "@/utils/env";
import {getTargetHandTranslation} from "@/components/BlackJack/CardDeck/service";
import {BlackJackPubSub, BlackJackPubSubEvent} from "@/components/BlackJack/pub-sub";

/*
 * Simulate the animation of allocating card from Deck
 * to dealer hand, player hand
 * This is for UI visual only, no gameplay logic related
 *
 * Usage: BlackJackPubSub.emit(BlackJackPubSubEvent.AnimateCard, 1)
 */
export default function CardBackTranslate() {
  const [animating, setAnimating] = useState(false)
  const [to, setTo] = useState({x: 0, y: 0})

  // auto hide & stop animating after 1s
  useEffect(() => {
    if (animating) {
      setTimeout(() => {
        setAnimating(false)
      }, 1000)
    }
  }, [animating])

  // const translateCardToPos = (pos: {x: number, y: number}) => {
  //   setTo(pos)
  //   setAnimating(true)
  // }

  /**
   * @param handIdx // dealer owns hand 0, player 1 owns hand 1
   */
  const translateCardToHand = useCallback((handIdx: number) => {
    const pos = getTargetHandTranslation(handIdx)
    console.log('{translateCardToHand} handIdx, pos: ', handIdx, pos);
    // translateCardToPos(pos)
    setTo(pos)
    setAnimating(true)
  }, [setTo, setAnimating])

  useEffect(() => {
    const handleAnimRequest = (handIdx: number) => {
      console.log('{handleAnimRequest} handIdx: ', handIdx);
      translateCardToHand(handIdx)
    }

    BlackJackPubSub.on(BlackJackPubSubEvent.AnimateCard, handleAnimRequest)
    return () => {
      BlackJackPubSub.off(BlackJackPubSubEvent.AnimateCard, handleAnimRequest)
    }
  }, [translateCardToHand])

  return (
    <>
      {!animating ? null : <motion.div
        // initial={{}}
        animate={to}
        transition={{
          duration: 0.6,
          // ease: "easeInOut", // can be custom curve
          ease: [0.1, 0.75, 0.65, 0.95],
        }}
      >
        <CardBack />
      </motion.div>
      }
    </>
  )
}