import React from "react";
import Box from "@mui/material/Box";
import Ratingtable from "./../ratingTable/ratingtable.jsx";
import DashboardStats from "./../adminCard/adminCard.jsx";

export default function CSSGridR() {
  return (
    <Box sx={{width: 1}}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={9}>
        <Box gridColumn="span 12">
          <DashboardStats />
        </Box>
        <Box gridColumn="span 12">
          <div>
            <Ratingtable />
          </div>
        </Box>
      </Box>
    </Box>
  );
}