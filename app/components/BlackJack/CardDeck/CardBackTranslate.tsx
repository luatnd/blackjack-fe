import {useEffect, useState} from "react";
import {motion, AnimatePresence, useAnimate, usePresence, ValueAnimationTransition} from "framer-motion"
import {CardBack} from "@/components/BlackJack/Hand/Card";


export default function CardBackTranslate() {
  const [animating, setAnimating] = useState(false)
  const [to, setTo] = useState({x: -560, y: 40})

  // auto hide stop animating after 1s
  useEffect(() => {
    if (animating) {
      setTimeout(() => {
        setAnimating(false)
      }, 1000)
    }
  }, [animating])

  const translateCardTo = (dealer: boolean) => {
    setTo(dealer ? {x: -560, y: -214} : {x: -560, y: 40} )

    setAnimating(true)
  }

  const getTargetTranslateConfig = () => {
    // dx = pos of last card - pos of current deck => get it from mobx
    let dx = 0, dy = 0; // delta = 0  mean no move
    return {x: dx, y: dy}
  }

  return (
    <>
      {animating ? <motion.div
        initial={{}}
        animate={to}
        transition={{
          duration: 0.6,
          // ease: "easeInOut", // can be custom curve
          ease: [0.1, 0.75, 0.65, 0.95],
        }}
      >
        <CardBack/>
      </motion.div>
        : null
    }
      <button onClick={() => translateCardTo(true)}>to dealer</button>
      <button onClick={() => translateCardTo(false)}>to player</button>
    </>
  )
}
