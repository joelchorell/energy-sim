from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator
from simulate.core import simulate_year
from simulate.regions import REGIONS

# --- Swagger / Metadata ---
app = FastAPI(
    title="⚡ EnergySim API",
    version="1.3.0",
    description=(
        "EnergySim is an API that simulates electricity generation and demand "
        "balance based on the selected energy mix.\n\n"
        "Built with **FastAPI** and **Python**.\n\n"
        "**Endpoints:**\n"
        "- `GET /` – Health check\n"
        "- `POST /simulate` – Run a yearly energy mix simulation"
    ),
    contact={
        "name": "Joel Chorell",
        "url": "https://github.com/joelchorell/energy-sim",
        "email": "joelchorell@gmail.com",
    },
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# --- Global exception handling ---
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] Unexpected: {exc}")
    return JSONResponse(status_code=500, content={"error": "An unexpected server error occurred."})

# --- Root endpoint ---
@app.get("/", tags=["System"])
def read_root():
    return {"message": "EnergySim backend is running 🚀"}

# --- Input model ---
class SimulationInput(BaseModel):
    solar: float = Field(ge=0, le=100, description="Share of solar energy in %")
    wind: float = Field(ge=0, le=100, description="Share of wind power in %")
    nuclear: float = Field(ge=0, le=100, description="Share of nuclear power in %")
    hydro: float = Field(ge=0, le=100, description="Share of hydropower in %")
    gas: float = Field(ge=0, le=100, description="Share of natural gas in %")
    coal: float = Field(ge=0, le=100, description="Share of coal power in %")
    oil: float = Field(ge=0, le=100, description="Share of oil-fired power in %")
    region: str = Field(default="northern_europe", description="Region (e.g., northern_europe)")
    verbose: bool = False

    @model_validator(mode="after")
    def check_total_mix(self):
        total = (
            self.solar + self.wind + self.nuclear +
            self.hydro + self.gas + self.coal + self.oil
        )
        if not 99.9 <= total <= 100.1:
            raise ValueError(f"Total mix must equal exactly 100% (got {total:.1f}%)")
        if self.region not in REGIONS:
            raise ValueError(f"Unknown region: {self.region}")
        return self

# --- Simulation endpoint ---
@app.post("/simulate", tags=["Simulation"])
def run_simulation(data: SimulationInput):
    mix = {
        "solar": data.solar,
        "wind": data.wind,
        "nuclear": data.nuclear,
        "hydro": data.hydro,
        "gas": data.gas,
        "coal": data.coal,
        "oil": data.oil,
    }

    try:
        result = simulate_year(mix_percent=mix, region=data.region, verbose=data.verbose)
        return {
            "status": "success",
            "region": data.region,
            "input_mix": mix,
            "simulation_mode": "year",
            "result": result,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[ERROR] Simulation failed: {e}")
        raise HTTPException(status_code=500, detail="Simulation error")