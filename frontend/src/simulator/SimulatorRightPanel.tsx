import { Box, Card, CardContent, Typography } from "@mui/material";
// Behåll den Grid-import du redan har som funkar
import Grid from "@mui/material/Grid";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { useSimulator } from "../context/SimulatorContext";

export default function SimulatorRightPanel() {
  const { result } = useSimulator();

  // Ingen simulering än
  if (!result) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.6)",
          fontSize: 18,
        }}
      >
        Run a simulation to see results.
      </Box>
    );
  }

  // ---------------------------
  // Helpers & data massage
  // ---------------------------
  const fmt = (n: number) => new Intl.NumberFormat("sv-SE").format(n);

  const r: any = result;

  // hourly_data från backend är objekt med tre arrayer
  const demandArr: number[] = r.hourly_data?.demand_mw ?? [];
  const genArr: number[] = r.hourly_data?.total_generation_mw ?? [];
  const socArr: number[] = r.hourly_data?.battery_soc ?? [];

  const len = demandArr.length;
  const hourly = Array.from({ length: len }, (_, i) => ({
    hour: i,
    demand: demandArr[i],
    generation: genArr[i],
    soc: socArr[i] ?? 0,
  }));

  // Balans och stress
  const balances = hourly.map((h) => h.generation - h.demand);
  const peakImbalance = balances.length
    ? Math.max(...balances.map((b) => Math.abs(b)))
    : 0;
  const stressScore = Math.min(100, Math.round((peakImbalance / 50000) * 100)); // normaliserat mot 50 GW

  // Emissioner per källa
  const emissionsBySource: Record<string, number> =
    r.emissions_by_source_tonnes ?? {};

  const emissionsArray = Object.entries(emissionsBySource).map(
    ([name, value]) => ({ name, value })
  );

  const totalHours = hourly.length || 1;
  const hoursUnmet: number = r.hours_unmet ?? 0;
  const coverage = Math.round(100 * (1 - hoursUnmet / totalHours));

  const totalSurplusTwh: number = r.total_surplus_twh ?? 0;
  const totalUnmetTwh: number = r.total_unmet_twh ?? 0;
  const netSurplusTwh = totalSurplusTwh - totalUnmetTwh;

  const totalEmissionsTonnes: number = r.total_emissions_tonnes ?? 0;
  const avgIntensity: number = r.avg_emission_intensity ?? 0; // t/MWh

  // För grafen: visa första veckan så det inte blir 8760 punkter
  const chartData = hourly.slice(0, 24 * 7);

  // ---------------------------
  // UI – exakt samma grid-layout
  // ---------------------------
  return (
    <Box sx={{ p: 4, height: "100%", overflowY: "auto" }}>
      <Grid container spacing={3} maxWidth={1600} mx="auto">
        {/* TOP 3 CARDS – samma size & height (220) */}

        {/* Card 1 – Energy Balance */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 220 }}>
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Energy Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {fmt(Math.round(netSurplusTwh))} TWh
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                Net annual surplus (generation − unmet)
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Shortage hours: <b>{hoursUnmet}</b>
              </Typography>
              <Typography variant="body2">
                Max shortage: <b>{fmt(r.max_unmet_mw ?? 0)} MW</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 – Reliability */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 220 }}>
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reliability
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {coverage}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                Supply coverage (hours with enough generation)
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  height: 6,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${coverage}%`,
                    height: "100%",
                    background:
                      coverage > 90
                        ? "limegreen"
                        : coverage > 70
                        ? "gold"
                        : "orangered",
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 – Emissions summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 220 }}>
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Emissions
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {fmt(Math.round(totalEmissionsTonnes / 1000))} kton
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                Total annual CO₂
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Intensity:{" "}
                <b>{Math.round(avgIntensity * 1000)} g/kWh</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* MAIN CHART – exakt samma Grid size={12}, height 500 */}
        <Grid size={12}>
          <Card sx={{ height: 500 }}>
            <CardContent sx={{ height: "100%", pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Demand vs Generation (first 7 days)
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                  <XAxis dataKey="hour" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="orange"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="generation"
                    stroke="#33c9ff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* BOTTOM 3 CARDS – samma size & height (150) */}

        {/* Card 4 – Grid Stress */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 150 }}>
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Grid Stress
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "stress", value: stressScore },
                      { name: "rest", value: 100 - stressScore },
                    ]}
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={180}
                    endAngle={0}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    <Cell
                      fill={
                        stressScore > 70
                          ? "red"
                          : stressScore > 40
                          ? "gold"
                          : "limegreen"
                      }
                    />
                    <Cell fill="rgba(255,255,255,0.08)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Typography
                variant="body2"
                sx={{ textAlign: "center", mt: -2, opacity: 0.8 }}
              >
                {stressScore}% peak imbalance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 – Emissions by source */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 150 }}>
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Emissions by Source
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <BarChart data={emissionsArray}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value: any) =>
                      `${fmt(Math.round(value as number))} t`
                    }
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    fill="#ff66cc"
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 6 – Battery SOC */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 150 }}>
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Battery State of Charge
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="socGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#33ffcc"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor="#33ffcc"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    formatter={(v: any) => `${Math.round(v as number)}%`}
                    labelFormatter={(i) => `Hour ${i}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="soc"
                    stroke="#33ffcc"
                    strokeWidth={2}
                    fill="url(#socGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}