import {useCallback, useEffect, useState} from "react";
import {motion} from "framer-motion"
import {CardBack} from "@/components/BlackJack/Hand/Card";
import {isClientDevMode} from "@/utils/env";
import {CARD_SPACING, getDeltaTranslationFromFirstCards, getTargetHandTranslation} from "@/components/BlackJack/CardDeck/service";
import {BlackJackPubSub, BlackJackPubSubEvent} from "@/components/BlackJack/pub-sub";


export const CARD_ANIM_TIME = 1; // secs
export const CARD_HIDE_DELAY_MS = 0; // in millisecs

/**
 * Like CardBackTranslateSingle but have a pool of cards
 * Support multiple card transition in parallel
 * @deprecated
 */
export function CardBackTranslateStack() {
  type Pos = {x: number, y: number}
  type TranslateId = string
  const translateId = (handIdx: number, cardIdx: number) => `${handIdx}_${cardIdx}`

  // card transition pool
  const [anim, setAnim] = useState<Record<TranslateId, boolean>>({})
  const [toPos, setToPos] = useState<Record<TranslateId, Pos>>({})


  const requestNewTransition = (handIdx: number, cardIdx: number) => {
    const id = translateId(handIdx, cardIdx)

    const firstPos = getDeltaTranslationFromFirstCards(handIdx)
    const destination = firstPos
    destination.x += cardIdx * CARD_SPACING

    // add new anim el to DOM // translate
    console.log('{transition show} id: ', id);
    setAnim({...anim, [id]: true})
    setToPos({...toPos, [id]: destination})

    // cleanup
    setTimeout(() => {
      console.log('{transition hide} id: ', id);
      delete anim[id]
      delete toPos[id]
      setAnim(anim)
      setToPos(toPos)
    }, CARD_ANIM_TIME * 1000 + CARD_HIDE_DELAY_MS)
  }
  if (isClientDevMode) {
    // @ts-ignore
    window.tmp__requestNewTransition = requestNewTransition
  }


  const txStyle = {
    duration: CARD_ANIM_TIME,
    ease: [0.16, 0.91, 0, 0.98], // super fast at begin, super slow at end
  }

  useEffect(() => {

  }, [anim])


  useEffect(() => {
    const handleAnimRequest = (data: {handIdx: number, cardIdx: number}) => {
      console.log('{handleAnimRequest} handIdx: ', data);
      const {handIdx, cardIdx} = data;
      requestNewTransition(handIdx, cardIdx)
    }

    BlackJackPubSub.on(BlackJackPubSubEvent.AnimateMultiCard, handleAnimRequest)
    return () => {
      BlackJackPubSub.off(BlackJackPubSubEvent.AnimateMultiCard, handleAnimRequest)
    }
  }, [requestNewTransition])

  return (
    <>
      {Object.keys(anim).map(id => {
        if (!anim[id]) return null

        return <motion.div
          key={id}
          // initial={{}}
          animate={toPos[id]}
          transition={txStyle}
        >
          <CardBack />
        </motion.div>
      })}
    </>
  )
}





/*
 * Simulate the animation of allocating card from Deck
 * to dealer hand, player hand
 * This is for UI visual only, no gameplay logic related
 *
 * Usage: BlackJackPubSub.emit(BlackJackPubSubEvent.AnimateCard, 1)
 */
export function CardBackTranslateSingle() {
  // old logic for single card transition
  const [animating, setAnimating] = useState(false)
  const [to, setTo] = useState({x: 0, y: 0})

  // auto hide & stop animating after 1s
  useEffect(() => {
    if (animating) {
      setTimeout(() => {
        setAnimating(false)
        console.log('{CardBackTranslateSingle > hide} : ', );
      }, CARD_ANIM_TIME * 1000 + CARD_HIDE_DELAY_MS) // hide after time offset
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
    // console.log('{translateCardToHand} handIdx, pos: ', handIdx, pos);
    // translateCardToPos(pos)
    setTo(pos)
    setAnimating(true)
  }, [setTo, setAnimating])

  useEffect(() => {
    const handleAnimRequest = (handIdx: number) => {
      // console.log('{handleAnimRequest} handIdx: ', handIdx);
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
          duration: CARD_ANIM_TIME,
          // ease: "easeInOut", // can be custom curve
          // ease: [0.1, 0.75, 0.65, 0.95],
          ease: [0.16, 0.91, 0, 0.98], // super fast at begin, super slow at end
        }}
      >
        <CardBack />
      </motion.div>
      }
    </>
  )
}
