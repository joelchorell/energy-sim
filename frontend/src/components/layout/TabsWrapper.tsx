import { Box, Tabs, Tab } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";

export default function TabsWrapper({
  intro,
  simulator,
}: {
  intro: ReactNode;
  simulator: ReactNode;
}) {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: "1px solid #eee", mb: 2 }}
      >
        <Tab label="Overview" />
        <Tab label="Simulator" />
      </Tabs>

      {/* Render selected tab */}
      <Box sx={{ mt: 2 }}>{tab === 0 ? intro : simulator}</Box>
    </Box>
  );
}