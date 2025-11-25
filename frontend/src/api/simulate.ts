import axios from "axios";

export async function runSimulation(mix: Record<string, number>, region = "northern_europe") {
  const payload = {
    ...mix,
    region,
    verbose: false,
  };

  const response = await axios.post("http://127.0.0.1:8000/simulate", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.result;
} 