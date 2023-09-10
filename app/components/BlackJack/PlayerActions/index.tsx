import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {AddOutlined, SportsKabaddi, StyleOutlined} from "@mui/icons-material";
import {useEffect, useState} from "react";

type Props = {
  createNewMatch: () => void,
  hit: () => void,
  stay: () => void,

  delay: number,

  allowHit: boolean,
  allowStay: boolean,
  allowCreate: boolean,
}
export function PlayerActions(props: Props) {
  const {delay, allowCreate} = props;
  const [time, setTime] = useState(delay)

  // countdown ticker when allowCreate
  useEffect(() => {
    let intervalId: any = undefined
    if (allowCreate) {
      // start count down from delay
      let c = delay;
      intervalId = setInterval(() => {
        if (c < -1) { // c<-1 to make time -1 so it will not show count down string
          clearInterval(intervalId)
        } else {
          setTime(c--)
        }
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [allowCreate, delay, setTime])


  const countDownStr = time >= 0  ? ` (${secondsToMMSS(time)})` : ''
  const canCreate = props.allowCreate && time <= 0

  return (
    <Stack
      direction="row" spacing={2} alignItems="flex-start" justifyContent="center"
      sx={{mt: 3}}
    >
      <Button onClick={props.hit} disabled={!props.allowHit} variant="contained" startIcon={<SportsKabaddi />}>
        Hit
      </Button>
      <Button onClick={props.stay} disabled={!props.allowStay} variant="contained" startIcon={<StyleOutlined />}>
        Stay
      </Button>
      <Button onClick={props.createNewMatch} disabled={!canCreate} variant="contained" startIcon={<AddOutlined />}>
        New Match {countDownStr}
      </Button>
    </Stack>
  )
}

function secondsToMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const MM = String(m).padStart(2, '0');
  const SS = String(s).padStart(2, '0');

  return `${MM}:${SS}`;
}
