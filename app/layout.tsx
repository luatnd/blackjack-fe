'use client'
import { PropsWithChildren } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'

import './globals.css'
import { darkTheme } from './theme/themes'
import Head from "./head";

// this is _app.tsx of NextJs 12
export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html lang='en'>
      <Head/>
      <ThemeProvider theme={darkTheme}>
        <body>
          <CssBaseline />
          {children}
        </body>
      </ThemeProvider>
    </html>
  )
}
