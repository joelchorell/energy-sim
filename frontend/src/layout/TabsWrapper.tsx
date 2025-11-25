import { Box, Tabs, Tab } from "@mui/material";
import type { ReactNode } from "react";

export default function TabsWrapper({
  intro,
  simulator,
  tab,
  setTab,
}: {
  intro: ReactNode;
  simulator: ReactNode;
  tab: number;
  setTab: (tab: number) => void;
}) {

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered
      >
        <Tab label="Overview" />
        <Tab label="Simulator" />
      </Tabs>

      {/* Render selected tab */}
      <Box sx={{ mt: 2 }}>{tab === 0 ? intro : simulator}</Box>
    </Box>
  );
}