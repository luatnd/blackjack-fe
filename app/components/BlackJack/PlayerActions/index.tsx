import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {AddOutlined, SportsKabaddi, StyleOutlined} from "@mui/icons-material";

export function PlayerActions() {
  return (
    <Stack
      direction="row" spacing={2} alignItems="flex-start" justifyContent="center"
      sx={{mt: 3}}
    >
      <Button variant="contained" startIcon={<SportsKabaddi />}>
        Hit
      </Button>
      <Button variant="contained" startIcon={<StyleOutlined />}>
        Stay
      </Button>
      <Button disabled={true} variant="contained" startIcon={<AddOutlined />}>
        New Match (00:00)
      </Button>
    </Stack>
  )
}
