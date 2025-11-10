from typing import Mapping, Optional, List, Sequence
from simulate.regions import REGIONS
from simulate.sources import ENERGY_SOURCES, SEASON_MODIFIERS, BATTERY_DEFAULTS
from simulate.utils import mw_to_twh
from simulate.models import SimulationResult, SimulationSummary, HourlyData


def _simulate(
    mix_percent: Mapping[str, float],
    demand_profile: Sequence[float],
    region: str,
    hours: int,
    seasonal: bool = True,
    demand_modifier: Optional[List[float]] = None,
    verbose: bool = True,
) -> SimulationResult:
    """
    Core simulation engine used by both simulate_year() and simulate_day().
    """

    TOTAL_CAPACITY_MW = REGIONS.get(region, {}).get("total_capacity_mw", 1000)
    installed = {s: (mix_percent.get(s, 0.0) / 100.0) * TOTAL_CAPACITY_MW for s in mix_percent}

    # Expand demand to match hours
    days = hours // 24
    demand = list(demand_profile) * days + list(demand_profile[: (hours % 24)])

    # Battery setup
    soc = 0.5 * BATTERY_DEFAULTS["capacity_mwh"]
    capacity = BATTERY_DEFAULTS["capacity_mwh"]
    charge_limit = BATTERY_DEFAULTS["max_charge_mw"]
    discharge_limit = BATTERY_DEFAULTS["max_discharge_mw"]
    eff = BATTERY_DEFAULTS["efficiency"]

    # Data containers
    total_generated = [0.0] * hours
    battery_soc_list = [0.0] * hours
    total_emissions_tonnes = 0.0
    emissions_by_source = {s: 0.0 for s in ENERGY_SOURCES}

    # --- Simulation loop ---
    for hour in range(hours):
        hour_of_day = hour % 24
        month = min(11, hour // 720) if seasonal else 6

        if seasonal and demand_modifier:
            demand[hour] *= demand_modifier[month]

        for source, data in ENERGY_SOURCES.items():
            cf = data["cf"][hour_of_day]
            season_factor = SEASON_MODIFIERS[source][month] if seasonal else 1.0
            produced = installed.get(source, 0.0) * cf * season_factor
            total_generated[hour] += produced

            emission_factor = data.get("emission_factor", 0.0)
            emissions_tonnes = produced * emission_factor / 1e3  # gCO₂ → tonnes
            total_emissions_tonnes += emissions_tonnes
            emissions_by_source[source] += emissions_tonnes

        net = total_generated[hour] - demand[hour]
        if net > 0:
            charge = min(net, charge_limit, capacity - soc)
            soc += charge * eff
        elif net < 0:
            discharge = min(-net, discharge_limit, soc)
            soc -= discharge / eff
            total_generated[hour] += discharge

        battery_soc_list[hour] = (soc / capacity) * 100

    # --- Summaries ---
    balance = [total_generated[h] - demand[h] for h in range(hours)]
    surplus = [max(0, b) for b in balance]
    unmet = [max(0, -b) for b in balance]

    summary = SimulationSummary(
        region=region,
        total_surplus_twh=mw_to_twh(sum(surplus)),
        total_unmet_twh=mw_to_twh(sum(unmet)),
        total_emissions_tonnes=total_emissions_tonnes,
        avg_emission_intensity=total_emissions_tonnes / (mw_to_twh(sum(total_generated)) * 1e6),
        hours_unmet=sum(1 for u in unmet if u > 0),
        max_unmet_mw=max(unmet),
        max_surplus_mw=max(surplus),
    )

    hourly = HourlyData(
        demand_mw=demand,
        total_generation_mw=total_generated,
        battery_soc=battery_soc_list,
    )

    return SimulationResult(
        **summary.dict(),
        emissions_by_source_tonnes=emissions_by_source,
        hourly_data=hourly,
    )


def simulate_year(mix_percent: Mapping[str, float], region: str = "northern_europe", verbose: bool = False) -> SimulationResult:
    region_data = REGIONS.get(region)
    if not region_data:
        raise ValueError(f"Unknown region: {region}")

    return _simulate(
        mix_percent=mix_percent,
        demand_profile=region_data["demand_profile"],
        demand_modifier=region_data["demand_modifier"],
        region=region,
        hours=8760,
        seasonal=True,
        verbose=verbose,
    )


def simulate_day(mix_percent: Mapping[str, float], mode: str = "challenge", verbose: bool = False) -> SimulationResult:
    CHALLENGE_DAY = [
        40, 38, 36, 35, 37, 45, 70, 90, 85, 60, 50, 45,
        48, 55, 60, 80, 100, 110, 95, 80, 70, 60, 50, 45,
    ]

    DEFAULT_DAY = [
        30, 28, 27, 26, 25, 30, 40, 50, 55, 60, 62, 64,
        65, 66, 68, 70, 75, 80, 78, 70, 60, 50, 40, 35,
    ]

    demand = CHALLENGE_DAY if mode == "challenge" else DEFAULT_DAY

    return _simulate(
        mix_percent=mix_percent,
        demand_profile=demand,
        region="generic_day",
        hours=24,
        seasonal=False,
        verbose=verbose,
    )


if __name__ == "__main__":
    mix = {"solar": 10, "wind": 25, "nuclear": 25, "hydro": 10, "gas": 15, "coal": 10, "oil": 5}

    print("\n=== TEST: FULL YEAR ===")
    res = simulate_year(mix, region="northern_europe", verbose=True)
    print(f"Total emissions: {res.total_emissions_tonnes:.0f} tCO₂")
    print(f"Per source: {res.emissions_by_source_tonnes}")