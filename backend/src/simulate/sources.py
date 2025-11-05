ENERGY_SOURCES = {
    "solar": {
        "cf": [0.00, 0.00, 0.00, 0.00, 0.02, 0.10, 0.30, 0.60,
               0.85, 0.95, 0.90, 0.80, 0.70, 0.60, 0.50, 0.30,
               0.15, 0.05, 0.01, 0.00, 0.00, 0.00, 0.00, 0.00],
        "emission_factor": 0.0,   # tons CO2/MWh (direct)
    },
    "wind": {
        "cf": [0.40, 0.35, 0.30, 0.30, 0.35, 0.50, 0.60, 0.65,
               0.70, 0.75, 0.80, 0.85, 0.80, 0.75, 0.70, 0.65,
               0.60, 0.55, 0.50, 0.45, 0.40, 0.40, 0.35, 0.35],
        "emission_factor": 0.0,
    },
    "hydro": {
        "cf": [0.50, 0.48, 0.45, 0.45, 0.50, 0.55, 0.60, 0.65,
               0.70, 0.75, 0.80, 0.80, 0.78, 0.75, 0.70, 0.65,
               0.60, 0.58, 0.55, 0.52, 0.50, 0.50, 0.50, 0.50],
        "emission_factor": 0.01,
    },
    "nuclear": {
        "cf": [0.95] * 24,
        "emission_factor": 0.005,
    },
    "coal": {
        "cf": [0.85] * 24,
        "emission_factor": 0.9,   # tons CO2/MWh (direct)
    },
    "gas": {
        "cf": [0.90] * 24,
        "emission_factor": 0.4,
    },
    "oil": {
        "cf": [0.85] * 24,
        "emission_factor": 0.7,
    }
}

# Säsongsmodifikationer (kan utökas per källa)
SEASON_MODIFIERS = {
    "solar":  [0.2, 0.3, 0.5, 0.8, 1.0, 1.1, 1.1, 1.0, 0.8, 0.5, 0.3, 0.2],
    "wind":   [1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.7, 0.7, 0.8, 1.0, 1.1, 1.2],
    "hydro":  [1.0, 0.9, 0.8, 0.8, 0.9, 1.0, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9],
    "nuclear": [1.0] * 12,
    "coal": [1.0] * 12,
    "gas": [1.0] * 12,
    "oil": [1.0] * 12,
}

# Batteri – pseudo-source
BATTERY_DEFAULTS = {
    "capacity_mwh": 1000,        # total energy storage
    "max_charge_mw": 250,        # max input/output per hour
    "max_discharge_mw": 250,
    "efficiency": 0.9,           # round-trip efficiency
}