import { useMutation } from "@tanstack/react-query";

export function useRunSimulation() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("http://localhost:8000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Simulation failed");
      return res.json();
    },
  });
}