'use client'
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import Paper from "@mui/material/Paper";
import {useEffect, useState} from "react";
import {encrypt_words, decrypt_words, encrypt_string, decrypt_string} from "@/services/CaesarEncrypt"
import {Stack, Switch} from "@mui/material";

export default function Playground() {
  const [pw, setPw] = useState("");
  const [supportedChars, setSupportedChars] = useState("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  const [wholeString, setWholeString] = useState(true);
  const [plainText, setPlainText] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [plainTextLastEdited, setPlainTextLastEdited] = useState(0);
  const [encryptedLastEdited, setEncryptedLastEdited] = useState(0);
  const [plainTextErr, setPlainTextErr] = useState("");
  const [encryptedErr, setEncryptedErr] = useState("");

  // refresh form
  useEffect(() => {
    const encrypting = plainTextLastEdited > encryptedLastEdited

    if (encrypting) {
      try {
        const s = wholeString
          ? encrypt_string(plainText, pw, supportedChars)
          : encrypt_words(plainText, pw, supportedChars)
        setEncrypted(s)
        setPlainTextErr("")
      } catch (e) {
        console.error('{decrypt} e: ', e);
        setPlainTextErr("Invalid input")
      }
    } else {
      try {
        const s = wholeString
          ? decrypt_string(encrypted, pw, supportedChars)
          : decrypt_words(encrypted, pw, supportedChars)
        setPlainText(s)
        setEncryptedErr("")
      } catch (e) {
        console.error('{decrypt} e: ', e);
        setEncryptedErr("Invalid input")
      }
    }
  }, [pw, supportedChars, wholeString, plainTextLastEdited, encryptedLastEdited, plainText, encrypted])

  return (
    <Paper elevation={1} sx={{p: 3, my: 5}}>
      <Typography variant="h5">
        Playground
      </Typography>
      <div>
        <TextField
          label="Password" fullWidth sx={{mt: 3}}
          value={pw} onChange={e => setPw(e.target.value)}
        />
        <Typography variant="caption">
          Program will encrypt only the supported characters, the other remain plaintexts.
        </Typography>

        <TextField
          label="Supported chars"
          value={supportedChars} onChange={e => setSupportedChars(e.target.value)}
          fullWidth
          sx={{mt: 3}}
        />
        <Typography variant="caption">
          Program will encrypt only the supported characters, the other remain plaintexts.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 2}}>
          <Typography>Word by word</Typography>
          <Switch
            checked={wholeString}
            onChange={e => setWholeString(e.target.checked)}
            color="primary"
          />
          <Typography>Whole string</Typography>
        </Stack>
        {!wholeString && <Typography variant="caption">
          Apply the password to each word, see <a href="#how-it-work"><b>How it work</b></a> section below for more detail
        </Typography>}
        {wholeString && <Typography variant="caption">
          Apply the password to the whole string, see <a href="#how-it-work"><b>How it work</b></a> section below for more detail
        </Typography>}
      </div>

      <Box sx={{mt: 5}}>
        <TextField
          id="outlined-multiline-static"
          label="Plaintext"
          multiline
          rows={6}
          value={plainText} onChange={e => {
          setPlainText(e.target.value)
          setPlainTextLastEdited(Date.now())
        }}
          error={!!plainTextErr}
          helperText={plainTextErr}
          sx={{width: '43%'}}
        />
        <div style={{width: '14%', display: "inline-block", textAlign: "center"}}>
          <IconButton color="primary" aria-label="add an alarm">
            <SwapHorizOutlinedIcon />
          </IconButton>
        </div>
        <TextField
          id="outlined-multiline-static"
          label="Encrypted"
          multiline
          rows={6}
          value={encrypted} onChange={e => {
          setEncrypted(e.target.value)
          setEncryptedLastEdited(Date.now())
        }}
          error={!!encryptedErr}
          helperText={encryptedErr}
          sx={{width: '43%'}}
        />
      </Box>
      <Typography variant="caption" textAlign="center" sx={{my: 5}}>
        Type or paste Plaintext/Encrypted to encrypt/decrypt between them
      </Typography>
    </Paper>
  )
}
