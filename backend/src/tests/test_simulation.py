# backend/src/tests/test_simulation.py
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def _valid_payload() -> dict:
    # Summerar till exakt 100 %
    return {
        "solar": 20,
        "wind": 20,
        "nuclear": 20,
        "hydro": 10,
        "gas": 10,
        "coal": 10,
        "oil": 10,
        "region": "northern_europe",
        "verbose": False,
    }


def test_simulation_returns_valid_result():
    payload = _valid_payload()
    r = client.post("/simulate", json=payload)

    assert r.status_code == 200, f"Unexpected status: {r.status_code}"
    body = r.json()

    # Top-level response shape
    for key in ["status", "region", "input_mix", "result"]:
        assert key in body, f"Missing '{key}' in response"

    assert body["status"] == "success"
    assert body["region"] == payload["region"]
    assert isinstance(body["input_mix"], dict)

    result = body["result"]

    # Summary fields (SimulationSummary)
    summary_keys = [
        "total_surplus_twh",
        "total_unmet_twh",
        "total_emissions_tonnes",
        "avg_emission_intensity",
        "hours_unmet",
        "max_unmet_mw",
        "max_surplus_mw",
        "region",
    ]
    for k in summary_keys:
        assert k in result, f"Missing summary key '{k}'"
    assert isinstance(result["hours_unmet"], int)

    # Emissions-by-source and hourly payloads
    assert "emissions_by_source_tonnes" in result
    assert isinstance(result["emissions_by_source_tonnes"], dict)

    assert "hourly_data" in result
    hourly = result["hourly_data"]
    for k in ["demand_mw", "total_generation_mw", "battery_soc"]:
        assert k in hourly, f"Missing hourly key '{k}'"
        assert isinstance(hourly[k], list), f"Hourly '{k}' must be a list"
        assert len(hourly[k]) > 0, f"Hourly '{k}' must not be empty"


def test_invalid_mix_sum_rejected():
    # Medvetet fel: summerar till 95 %
    bad_payload = {
        "solar": 10,
        "wind": 15,
        "nuclear": 20,
        "hydro": 10,
        "gas": 20,
        "coal": 10,
        "oil": 10,
        "region": "northern_europe",
        "verbose": False,
    }
    r = client.post("/simulate", json=bad_payload)

    # Model-validatorn kastar ValueError -> FastAPI returnerar 422
    assert r.status_code == 422, f"Expected 422, got {r.status_code}"
    body = r.json()
    # Rimlig sanity-koll på felmeddelande
    assert "detail" in body or "error" in body