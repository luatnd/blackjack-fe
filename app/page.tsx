'use client'
import * as React from "react";
import ContainerLayout from "@/(HeaderFooterLayout)/layout";
import HomePage from "@/(HeaderFooterLayout)/home/page";

export default function App() {
  return (
    <ContainerLayout>
      <HomePage />
    </ContainerLayout>
  )
}
