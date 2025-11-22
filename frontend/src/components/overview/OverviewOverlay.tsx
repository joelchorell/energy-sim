import { Box, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import GlowCurve from "./GlowCurve";

export default function OverviewOverlay(): ReactElement {
  return (
    <Box
  sx={{
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    backdropFilter: "blur(8px)",
    background: "rgba(10,10,15,0.25)",
  }}
>
      <NeonOrbs />
      <GlowCurve />
      <ParticleLayer />
      <CenterContent />
    </Box>
  );
}

/* ---------------- Neon Orbs ---------------- */

function NeonOrbs() {
  return (
    <>
      <Box
        component={motion.div}
        initial={{ x: -120, y: -80, opacity: 0.7 }}
        animate={{ x: 40, y: 10, opacity: 1 }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #ff00ff 0, #6400ff 40%, transparent 70%)",
          filter: "blur(40px)",
          opacity: 0.7,
        }}
      />

      <Box
        component={motion.div}
        initial={{ x: 200, y: 200, opacity: 0.2 }}
        animate={{ x: 140, y: 120, opacity: 0.5 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 20%, #00f0ff 0, #0055ff 40%, transparent 70%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

/* ---------------- Particles ---------------- */

function ParticleLayer() {
  const particles = Array.from({ length: 24 });

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {particles.map((_, i) => {
        const baseX = (i * 37) % 100;
        const baseY = (i * 53) % 100;
        const delay = (i * 0.7) % 5;

        return (
          <Box
            key={i}
            component={motion.div}
            initial={{
              x: `${baseX}%`,
              y: `${baseY}%`,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              y: [`${baseY}%`, `${baseY - 8}%`, `${baseY}%`],
              opacity: [0, 0.7, 0],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background:
                i % 3 === 0
                  ? "#71f3ff"
                  : i % 3 === 1
                  ? "#ff71ff"
                  : "#8b8dff",
              boxShadow: "0 0 10px rgba(160,200,255,0.9)",
            }}
          />
        );
      })}
    </Box>
  );
}

/* ---------------- Center Content ---------------- */

function CenterContent() {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 5,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#f5f5ff",
        px: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          mb: 1,
        }}
      >
        Overview
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 420,
          opacity: 0.9,
          fontSize: 14,
          mb: 2,
        }}
      >
        Get a high-level view of your energy system before unlocking the full
        simulator.
      </Typography>

      <Chip
        label="Switch to SIMULATOR"
        sx={{
          mt: 1,
          borderRadius: "999px",
          border: "1px solid rgba(180,180,255,0.4)",
          background:
            "linear-gradient(90deg, rgba(140,0,255,0.25), rgba(0,160,255,0.25))",
          color: "#f8f8ff",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      />
    </Box>
  );
}