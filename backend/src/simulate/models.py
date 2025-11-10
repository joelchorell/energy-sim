from pydantic import BaseModel
from typing import List, Dict


class HourlyData(BaseModel):
    demand_mw: List[float]
    total_generation_mw: List[float]
    battery_soc: List[float]


class SimulationSummary(BaseModel):
    region: str
    total_surplus_twh: float
    total_unmet_twh: float
    total_emissions_tonnes: float
    avg_emission_intensity: float
    hours_unmet: int
    max_unmet_mw: float
    max_surplus_mw: float


class SimulationResult(SimulationSummary):
    emissions_by_source_tonnes: Dict[str, float]
    hourly_data: HourlyData