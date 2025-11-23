import { Box } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type LineDef = {
  d: string;
  color: string;
  width: number;
  baseDelay: number;
  randomShift: number;
};

export default function CircuitGrid() {
  const lines: LineDef[] = [
    {
      d: "M50 120 H300 V200 H600 V260 H900",
      color: "rgba(255,170,90,0.85)",
      width: 3,
      baseDelay: 0,
      randomShift: 40,
    },
    {
      d: "M80 320 H380 V340 H650 V420 H1100",
      color: "rgba(255,190,110,0.9)",
      width: 3,
      baseDelay: 0.5,
      randomShift: 50,
    },
    {
      d: "M40 200 H250 V260 H500 V300 H900",
      color: "rgba(255,150,70,0.35)",
      width: 2,
      baseDelay: 1.2,
      randomShift: 60,
    },
    {
      d: "M100 450 H480 V480 H760 V520 H1150",
      color: "rgba(255,150,70,0.28)",
      width: 2,
      baseDelay: 1.5,
      randomShift: 40,
    },
    {
      d: "M0 600 H300 V630 H900 V650 H1200",
      color: "rgba(255,120,40,0.15)",
      width: 1.4,
      baseDelay: 2.2,
      randomShift: 30,
    },
  ];

  return (
    <Box sx={{ position: "absolute", inset: 0, opacity: 0.45 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="orange-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(255,140,40,0.7)" />
          </filter>
        </defs>

        {lines.map((line, index) => (
          <AnimatedTrace key={index} {...line} />
        ))}
      </svg>
    </Box>
  );
}

/* -----------------------------------------
   🔥 LOOPING, RANDOMIZED, SMOOTH FADE TRACE
------------------------------------------- */

function AnimatedTrace({ d, color, width, baseDelay, randomShift }: LineDef) {
  const controls = useAnimationControls();

  useEffect(() => {
    let isActive = true;

    async function loop() {
      while (isActive) {
        const shiftX = (Math.random() - 0.5) * randomShift;

        // Step 1 — Fade in + draw
        // Step 1 — Fade in + draw (slow)
        await controls.start({
        pathLength: [0, 1],
        opacity: [0, 0.8],
        translateX: shiftX,
        transition: {
            duration: 5.5,     // <-- var 2.8
            ease: "easeInOut",
            delay: baseDelay,
        },
        });

        // Step 2 — Hold (longer, calmer)
        await controls.start({
        opacity: 0.8,
        transition: { duration: 2.5 }, // <-- var 1.2
        });

        // Step 3 — Fade out (slow)
        await controls.start({
        opacity: 0,
        transition: { duration: 3.0, ease: "easeOut" }, // <-- var 1.4
        });

        // Extra breathing pause
        await new Promise((r) => setTimeout(r, 800)); // <-- var 500
      }
    }

    loop();
    return () => {
      isActive = false;
    };
  }, [controls, baseDelay, randomShift]);

  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      filter="url(#orange-glow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={controls}
    />
  );
}