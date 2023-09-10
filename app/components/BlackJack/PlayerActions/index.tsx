import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {AddOutlined, SportsKabaddi, StyleOutlined} from "@mui/icons-material";

type Props = {
  createNewMatch: () => void,
  hit: () => void,
  stay: () => void,
}
export function PlayerActions(props: Props) {
  return (
    <Stack
      direction="row" spacing={2} alignItems="flex-start" justifyContent="center"
      sx={{mt: 3}}
    >
      <Button onClick={props.hit} variant="contained" startIcon={<SportsKabaddi />}>
        Hit
      </Button>
      <Button onClick={props.stay} variant="contained" startIcon={<StyleOutlined />}>
        Stay
      </Button>
      <Button onClick={props.createNewMatch} disabled={true} variant="contained" startIcon={<AddOutlined />}>
        New Match (00:00)
      </Button>
    </Stack>
  )
}
