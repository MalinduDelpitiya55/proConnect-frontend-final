import React from 'react';
import Box from "@mui/material/Box";
import Paymenttable from "./../paymentTable/paymenttable.jsx";
import DashboardStats from "./../adminCard/adminCard.jsx";

export default function CSSGridP() {
  return (
    <Box sx={{width: 1}}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={9}>
        <Box gridColumn="span 12">
          <DashboardStats />
        </Box>
        <Box gridColumn="span 12">
          <div>
            <Paymenttable />
          </div>
        </Box>
      </Box>
    </Box>
  );
}