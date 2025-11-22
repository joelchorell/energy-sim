import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function GlowCurve() {
  const amplitude = 6; // smaller = smoother wave
  const speed = 18; // slower, more chill

  const generateSmoothPath = (offset = 0) => {
    const points = 8; // FEWER points = smoother spline
    let path = `M 0 50 `;

    for (let i = 1; i <= points; i++) {
      const x = (i / points) * 100;
      const angle = i + offset;
      const y = 50 + Math.sin(angle) * amplitude;

      path += `T ${x} ${y} `;
    }

    return path;
  };

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0.9,
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Neon Glow */}
        <defs>
          <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff00ff" />
            <stop offset="50%" stopColor="#9d4bff" />
            <stop offset="100%" stopColor="#00eaff" />
          </linearGradient>
        </defs>

        <motion.path
          stroke="url(#glow-gradient)"
          strokeWidth="1.6"
          fill="transparent"
          d={generateSmoothPath(0)}
          animate={{
            d: [
              generateSmoothPath(0),
              generateSmoothPath(1),
              generateSmoothPath(2),
              generateSmoothPath(1),
              generateSmoothPath(0)
            ]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter: `
              drop-shadow(0 0 10px rgba(255,0,255,0.35))
              drop-shadow(0 0 25px rgba(0,200,255,0.35))
              blur(1px)
            `
          }}
        />
      </motion.svg>
    </Box>
  );
}