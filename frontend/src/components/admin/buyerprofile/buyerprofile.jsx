import React from "react";
import Box from "@mui/material/Box";
import Buyertable from "./../buyerTable/buyertable.jsx";
import DashboardStats from "./../adminCard/adminCard.jsx";

export default function CSSGridB() {
  return (
    <Box sx={{width: 1}}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridGap={9}>
        <Box gridColumn="span 12">
          <DashboardStats />
        </Box>
        <Box gridColumn="span 12">
          <div>
            <Buyertable />
          </div>
        </Box>
      </Box>
    </Box>
  );
}
