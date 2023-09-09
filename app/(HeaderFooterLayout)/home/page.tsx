'use client'
import * as React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import GitHubButton from 'react-github-btn'
import Playground from "@/components/CaesarPassword/Playground";

export default function HomePage(ctx: any) {
  return (
    <>
      <Typography variant="h3" sx={{mt: 3}}>
        Caesar password
      </Typography>
      <Typography variant="h5">
        Simple deterministic encryption by combining caesar cipher with password
      </Typography>
      {/*<Typography variant="body1" sx={{my: 1}}>*/}
      {/*  Source Code: <a href="https://gist.github.com/luatnd/1adec00e1c5086ff6767ae681be20c47">*/}
      {/*  mxn0 encrypt with password*/}
      {/*</a>*/}
      {/*</Typography>*/}
      <GitHubButton
        href="https://github.com/luatnd/caesar-with-password"
        data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="luatnd/caesar-with-password on GitHub"
      >Caesar-with-password</GitHubButton>

      <Playground/>

      <Paper sx={{p: 3, my: 5}}>
        <Typography variant="h5" id="how-it-work">
          How it work
        </Typography>

        <Typography variant="body1" sx={{mt:1}}>
          <b>Word by word:</b><br/>
        </Typography>
        <pre style={{overflowX: 'auto'}}>{`.
supported characters = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
#-- shift sequences base on password ----
password      = Go4
base64(pass)  = R280

                    0         1         2         3
                    01234567890123456789012345678901234567890123456789012345678901
supported_chars   = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
                    x x     x                  x
Caesar shifts seq = R280 ==> [27, 2, 8, 0]

#-- caesar with shift sequences
plaintext     = lorem ipsum dol
base64(words) = bG9yZW0= aXBzdW0= ZG9s

#-- Encode the word "lorem":
                      0         1         2         3         4         5         6
supported_chars idx:  01234567890123456789012345678901234567890123456789012345678901
supported_chars     = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
base64(word)        = b  G 9 y Z  W 0 =
Caesar shifts seq   = 27 2 8 0 27 2 8 0
caesar(word)        = 2  I H y 0  Y 8 =
result = encrypted  = 2IHy0Y8=

same for word: ipsum
result = 1ZJz4Y8=
same for word: dol
result = 0IHs

final result = 2IHy0Y8= 1ZJz4Y8= 0IHs
        `}</pre>

        <Typography variant="body1" sx={{mt:1}}>
          <b>Whole string:</b><br/>
        </Typography>
        <pre style={{overflowX: 'auto'}}>{`---
supported characters = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
#-- shift sequences base on password ----
password      = Go4
base64(pass)  = R280

                    0         1         2         3
                    01234567890123456789012345678901234567890123456789012345678901
supported_chars   = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
                    x x     x                  x
Caesar shifts seq  = R280 ==> [27, 2, 8, 0]

#-- caesar with shift sequences, encode entire string
plaintext     = lorem ipsum dolor 
base64(text)  = bG9yZW0gaXBzdW0gZG9sb3I=

                      0         1         2         3         4         5         6
supported_chars idx:  01234567890123456789012345678901234567890123456789012345678901
supported_chars     = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
base64(text)        = b  G 9 y Z  W 0 g a  X B z d  W 0 g Z  G 9 s b  3 I =
Caesar shifts seq   = 27 2 8 0 27 2 8 0 27 2 8 0 27 2 8 0 27 2 8 0 27 2 8 0
caesar(string)      = 2  I H y 0  Y 8 g 1  Z J z 4  Y 8 g 0  I H s 2  5 Q =
result = encrypted  = 2IHy0Y8g1ZJz4Y8g0IHs25Q=
        `}</pre>

        <Typography variant="body1" sx={{mt:1}}>
          <b>Common rules:</b><br/>
          - Caesar only shift the character inside supported_chars<br/>
          - non-supported_chars will be ignored, have shift=0
        </Typography>
      </Paper>


      <Paper sx={{p: 3, my: 5}}>
        <Typography variant="h5" id="how-it-work">
          Why using this:
        </Typography>
        <Typography variant="body1" sx={{mt:1}}>
          - It's simple and can be encoded/decoded with your pen and paper, so you don't need to remember the web page / online tool you used to encode/decode<br/>
          - Large entropy because of using your password, no one can decode it except you
        </Typography>
        <Typography variant="body1" sx={{mt:1}}>
          NOTE1: "Word by word" encryption can be decrypted by AI bruteforce or smart people.<br/>
          NOTE2: If you need more secure encryption, plz use another method or software.
        </Typography>
      </Paper>
    </>
  )
}
