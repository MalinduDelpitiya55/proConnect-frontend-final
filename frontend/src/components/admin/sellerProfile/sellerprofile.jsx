import * as React from "react";
import Box from "@mui/material/Box";
import UserTable from "./../sellerTable/sellertable.jsx";
import DashboardStats from "./../adminCard/adminCard.jsx";

export default function CSSGridS() {
  return (
    <Box sx={{width: 1}}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={9}>
        <Box gridColumn="span 12">
          <DashboardStats />
        </Box>
        <Box gridColumn="span 12">
          <div>
            <UserTable />
          </div>
        </Box>
      </Box>
    </Box>
  );
}
