'use client'
import {PropsWithChildren} from 'react'
import {Container} from '@mui/material'

import Header from "./Header";
import Footer from "./Footer";

export default function ContainerLayout({children}: PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        {children}
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </>
  )
}
