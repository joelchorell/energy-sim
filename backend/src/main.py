from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator
from simulate.core import simulate_year
from simulate.regions import REGIONS


# --- Swagger / Metadata ---
app = FastAPI(
    title="⚡ EnergySim API",
    version="1.2.0",
    description=(
        "EnergySim is an API that simulates electricity generation and demand "
        "balance based on user-defined energy mixes.\n\n"
        "Built with **FastAPI** and **Python**.\n\n"
        "**Endpoints:**\n"
        "- `GET /` – system health check\n"
        "- `POST /simulate` – run a yearly simulation of an energy mix"
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)


# --- Global Exception Handling ---
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] Unexpected: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred on the server."},
    )


# --- Root Endpoint ---
@app.get("/", tags=["System"])
def read_root():
    return {"message": "EnergySim backend is running 🚀"}


# --- Simulation Input Model ---
class SimulationInput(BaseModel):
    solar: float = Field(ge=0, le=100, description="Solar energy share (%)")
    wind: float = Field(ge=0, le=100, description="Wind energy share (%)")
    nuclear: float = Field(ge=0, le=100, description="Nuclear energy share (%)")
    hydro: float = Field(ge=0, le=100, description="Hydropower share (%)")
    region: str = Field(default="northern_europe", description="Region identifier (e.g., northern_europe)")
    verbose: bool = False

    @model_validator(mode="after")
    def validate_mix_and_region(self):
        total = self.solar + self.wind + self.nuclear + self.hydro
        if total != 100:
            raise ValueError(f"Total mix must equal exactly 100% (got {total:.1f}%)")
        if self.region not in REGIONS:
            raise ValueError(f"Unknown region: {self.region}")
        return self


# --- Simulation Endpoint ---
@app.post("/simulate", tags=["Simulation"])
def run_simulation(data: SimulationInput):
    mix = {
        "solar": data.solar,
        "wind": data.wind,
        "nuclear": data.nuclear,
        "hydro": data.hydro,
    }

    try:
        result = simulate_year(
            mix_percent=mix,
            region=data.region,
            verbose=data.verbose
        )
        return {
            "status": "success",
            "region": data.region,
            "input_mix": mix,
            "result": result
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[ERROR] Simulation failed: {e}")
        raise HTTPException(status_code=500, detail="Simulation error")