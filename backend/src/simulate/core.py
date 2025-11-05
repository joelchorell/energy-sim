from typing import Mapping
from simulate.regions import REGIONS
from simulate.sources import ENERGY_SOURCES, SEASON_MODIFIERS
from simulate.utils import mw_to_twh


def simulate_year(
    mix_percent: Mapping[str, float],
    region: str = "northern_europe",
    year_hours: int = 8760,
    verbose: bool = True,
    debug: bool = False
):
    """
    Simulerar ett år (8760 timmar) med säsongsjusterad produktion och efterfrågan.
    """

    # --- Grunddata ---
    region_data = REGIONS.get(region)
    if not region_data:
        raise ValueError(f"Okänd region: {region}")

    demand_day = region_data["demand_profile"]
    demand_modifier = region_data["demand_modifier"]

    TOTAL_CAPACITY_MW = region_data["total_capacity_mw"]
    installed = {
        s: (mix_percent.get(s, 0.0) / 100.0) * TOTAL_CAPACITY_MW
        for s in mix_percent
    }

    # --- Skapa efterfrågekurva för hela året ---
    days = year_hours // 24
    demand = demand_day * days
    remainder = year_hours % 24
    if remainder:
        demand += demand_day[:remainder]

    # --- Förbered tomma resultatlistor ---
    production_by_source = {s: [0.0] * year_hours for s in ENERGY_SOURCES}
    total_generated = [0.0] * year_hours

    # --- Huvudloop: timme för timme ---
    for hour in range(year_hours):
        hour_of_day = hour % 24
        month = min(11, hour // 720)  # 720 = 30 dagar * 24 timmar
        demand[hour] *= demand_modifier[month]

        for source, data in ENERGY_SOURCES.items():
            cf = data["cf"][hour_of_day]
            season_factor = SEASON_MODIFIERS[source][month]
            effective_cf = cf * season_factor
            produced = installed.get(source, 0.0) * effective_cf
            production_by_source[source][hour] = produced
            total_generated[hour] += produced

    # --- Balans och summering ---
    balance = [total_generated[h] - demand[h] for h in range(year_hours)]
    surplus = [max(0, b) for b in balance]
    unmet = [max(0, -b) for b in balance]

    result = {
        "total_surplus_twh": mw_to_twh(sum(surplus)),
        "total_unmet_twh": mw_to_twh(sum(unmet)),
        "hours_unmet": sum(1 for u in unmet if u > 0),
        "max_unmet_mw": max(unmet),
        "max_surplus_mw": max(surplus),
        "region": region,
    }

    # --- Verbositet: översikt ---
    if verbose:
        print(f"\nRegion: {region}")
        print(f"Totalt överskott: {result['total_surplus_twh']:.2f} TWh")
        print(f"Totalt underskott: {result['total_unmet_twh']:.2f} TWh")
        print(f"Max underskott: {result['max_unmet_mw']:.1f} MW")
        print(f"Max överskott: {result['max_surplus_mw']:.1f} MW")

    # --- Debug/inspektion av exempeldata ---
    if debug:
        sample_hours = {
            "January": range(0, 24),
            "Juli": range(24 * 24 * 6, 24 * 24 * 6 + 24),
            "December": range(24 * 24 * 11, 24 * 24 * 11 + 24),
        }

        print("\n=== Example data ===")
        for month_name, hours in sample_hours.items():
            print(f"\n{month_name.upper()}")
            print("Hour | Demand | Solar | Wind | Nuclear | Hydro | Total")
            print("------------------------------------------------------------")
            for h in hours:
                print(
                    f"{h:5d} | {demand[h]:7.1f} | "
                    f"{production_by_source['solar'][h]:6.1f} | "
                    f"{production_by_source['wind'][h]:6.1f} | "
                    f"{production_by_source['nuclear'][h]:7.1f} | "
                    f"{production_by_source['hydro'][h]:6.1f} | "
                    f"{total_generated[h]:6.1f}"
                )

    return result


# --- Lokal körning ---
if __name__ == "__main__":
    mix = {"solar": 20, "wind": 30, "nuclear": 40, "hydro": 10}
    result = simulate_year(mix, region="northern_europe", verbose=True, debug=True)

    print("\n=== RESULT ===")
    print(f"Region: {result['region']}")
    print(f"Total surplus (TWh): {result['total_surplus_twh']:.2f}")
    print(f"Total unmet demand (TWh): {result['total_unmet_twh']:.2f}")
    print(f"Hours with unmet demand: {result['hours_unmet']}")
    print(f"Max unmet demant (MW): {result['max_unmet_mw']:.1f}")
    print(f"Max surplus (MW): {result['max_surplus_mw']:.1f}")