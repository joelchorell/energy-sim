import { Box, Typography, LinearProgress } from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useSimulator } from "../context/SimulatorContext";

export default function SimulatorRightPanel() {
  const { result } = useSimulator();

  // ------------------------
  // 1. BEFORE ANY SIMULATION
  // ------------------------
  if (!result) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.7,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Waiting for simulation...
        </Typography>
        <Typography variant="body2">
          Adjust your energy mix and click <strong>Simulate</strong>.
        </Typography>
      </Box>
    );
  }

  // ------------------------
  // 2. PREPARE CHART DATA
  // ------------------------
  const demand = result.hourly_data.demand_mw;
  const gen = result.hourly_data.total_generation_mw;

  const chart = demand.slice(0, 24).map((_, i) => ({
    hour: i,
    demand: demand[i],
    generation: gen[i],
  }));

  // ------------------------
  // 3. GRID STRESS CALC
  // ------------------------
  const stress = Math.min(
    100,
    Math.round((demand[12] / Math.max(gen[12], 1)) * 100)
  );

  const stressColor =
    stress < 60 ? "lightgreen" : stress < 90 ? "orange" : "red";

  // ------------------------
  // 4. RENDER
  // ------------------------
  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Simulation Results
      </Typography>

      {/* GRID STRESS METER */}
      <Typography sx={{ fontWeight: 600, mb: 1 }}>Grid Stress</Typography>
      <LinearProgress
        variant="determinate"
        value={stress}
        sx={{
          height: 12,
          borderRadius: 2,
          mb: 3,
          "& .MuiLinearProgress-bar": {
            backgroundColor: stressColor,
          },
        }}
      />
      <Typography sx={{ fontSize: 14, opacity: 0.8, mb: 3 }}>
        {stress}% stress (lower is better)
      </Typography>

      {/* DEMAND VS GENERATION GRAPH */}
      <Typography sx={{ fontWeight: 600, mb: 1 }}>
        Demand vs Generation (first 24h)
      </Typography>

      <LineChart width={600} height={250} data={chart}>
        <CartesianGrid stroke="#444" strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="demand" stroke="#ff7676" dot={false} />
        <Line
          type="monotone"
          dataKey="generation"
          stroke="#76c7ff"
          dot={false}
        />
      </LineChart>
    </Box>
  );
}