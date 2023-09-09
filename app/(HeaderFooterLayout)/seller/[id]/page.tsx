'use client'
import * as React from "react";
import Typography from "@mui/material/Typography";
import SellerProfile from "@/components/SellerProfile";
import {GoToSeller} from "@/components/SellerProfile/components/GoToSeller";
import Box from "@mui/material/Box";

export default function SellerPage(ctx: any) {
  let { id } = ctx.params ?? {};
  // console.log('{SellerPage} id: ', id);
  id = parseInt(id)

  return (
    <>
      {!isNaN(id)
        ? <SellerProfile sellerId={id} />
        : (
          <>
            <Typography variant="subtitle1" textAlign="center" sx={{my: 5}}>
              Seller profile does not exist
            </Typography>
            <Box sx={{mt: 5}}>
              <GoToSeller/>
            </Box>
          </>
        )
      }
    </>
  )
}
