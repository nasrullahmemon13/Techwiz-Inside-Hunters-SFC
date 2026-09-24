"""
Unit and Integration Tests for SRS Steps 40 and 41:
- Step 40: What-If Scenario Analysis (Simulation of the 8 SRS-mandated scenarios)
- Step 41: Scenario Impact Analysis (Evaluation across 5 indicators: Revenue, Margin, Demand, Wastage, Profitability)
- Mandatory Rule: Clearly identify simulated outputs as estimates rather than actual results.
"""

import os
import sys
import json
import pytest
import pandas as pd
import numpy as np

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.what_if_engine import (
    WhatIfScenarioEngine,
    SimulationResult,
    run_what_if_pipeline,
    SIMULATION_DISCLAIMER
)

OUTPUT_DIR = os.path.join(PROJECT_ROOT, "processed_data", "what_if")
REPORTS_DIR = os.path.join(PROJECT_ROOT, "reports", "what_if")


@pytest.fixture(scope="module")
def engine():
    return WhatIfScenarioEngine()


def test_engine_initialization(engine):
    """Assert WhatIfScenarioEngine initializes and builds unified baseline."""
    assert engine is not None
    assert not engine.baseline_df.empty
    assert len(engine.baseline_df) == 150
    assert "revenue" in engine.baseline_df.columns
    assert "contribution_margin" in engine.baseline_df.columns
    assert "avg_empirical_elasticity" in engine.baseline_df.columns
    assert "total_loss_amount" in engine.baseline_df.columns


def test_all_8_srs_step_40_scenarios_simulated(engine):
    """
    SRS Step 40 requirement:
    Users must be able to simulate selected scenarios such as:
      1. Increase menu price
      2. Reduce item price
      3. Change discount percentage
      4. Increase promotion frequency
      5. Remove a menu item
      6. Reduce preparation quantity
      7. Increase predicted demand
      8. Change wastage assumptions
    """
    results = [
        engine.simulate_increase_menu_price(item_id="ITEM-046", price_increase_pct=10.0),
        engine.simulate_reduce_item_price(item_id="ITEM-063", price_reduction_pct=10.0),
        engine.simulate_change_discount_percentage(current_discount_pct=10.0, new_discount_pct=20.0),
        engine.simulate_increase_promotion_frequency(promo_frequency_multiplier=1.5),
        engine.simulate_remove_menu_item(item_id="ITEM-051", demand_substitution_rate=0.50),
        engine.simulate_reduce_preparation_quantity(prep_reduction_pct=20.0),
        engine.simulate_increase_predicted_demand(demand_increase_pct=15.0),
        engine.simulate_change_wastage_assumptions(wastage_rate_change_pct=-25.0)
    ]

    expected_names = {
        "Increase menu price",
        "Reduce item price",
        "Change discount percentage",
        "Increase promotion frequency",
        "Remove a menu item",
        "Reduce preparation quantity",
        "Increase predicted demand",
        "Change wastage assumptions"
    }

    actual_names = {r.scenario_name for r in results}
    assert actual_names == expected_names
    assert len(results) == 8


def test_all_5_srs_step_41_indicators_present(engine):
    """
    SRS Step 41 requirement:
    The application should display the estimated impact on selected indicators such as:
      1. Revenue
      2. Contribution margin
      3. Demand
      4. Wastage
      5. Profitability
    """
    res = engine.simulate_increase_menu_price(item_id="ITEM-046", price_increase_pct=10.0)

    # 1. Revenue
    assert "baseline" in res.revenue
    assert "estimated" in res.revenue
    assert "delta" in res.revenue
    assert "pct_change" in res.revenue

    # 2. Contribution Margin
    assert "baseline_dollars" in res.contribution_margin
    assert "estimated_dollars" in res.contribution_margin
    assert "delta_dollars" in res.contribution_margin
    assert "baseline_pct" in res.contribution_margin
    assert "estimated_pct" in res.contribution_margin

    # 3. Demand
    assert "baseline_units" in res.demand
    assert "estimated_units" in res.demand
    assert "delta_units" in res.demand
    assert "pct_change" in res.demand

    # 4. Wastage
    assert "baseline_cost" in res.wastage
    assert "estimated_cost" in res.wastage
    assert "delta_cost" in res.wastage
    assert "pct_change" in res.wastage

    # 5. Profitability
    assert "baseline_net_profit" in res.profitability
    assert "estimated_net_profit" in res.profitability
    assert "delta_net_profit" in res.profitability
    assert "pct_change" in res.profitability

    # Summary table must present all 5 indicators
    summary_tbl = res.summary_table()
    assert len(summary_tbl) == 6  # 5 indicators + margin % breakdown
    assert "Revenue ($)" in summary_tbl["indicator"].values
    assert "Contribution Margin ($)" in summary_tbl["indicator"].values
    assert "Demand (Units Sold)" in summary_tbl["indicator"].values
    assert "Wastage Cost ($)" in summary_tbl["indicator"].values
    assert "Net Profitability ($)" in summary_tbl["indicator"].values


def test_mandatory_estimate_identification_rule(engine):
    """
    MANDATORY SRS Step 41 Rule:
    'The application must clearly identify simulated outputs as estimates rather than actual results.'
    """
    res = engine.simulate_reduce_item_price(item_id="ITEM-063", price_reduction_pct=10.0)

    # 1. Result object flag
    assert res.is_simulation_estimate is True

    # 2. Disclaimer must be present and explicit
    assert "ESTIMATE ONLY" in res.disclaimer
    assert "must not be interpreted as actual historical results" in res.disclaimer

    # 3. Serialized dictionary must include disclaimer and estimate tag
    d = res.to_dict()
    assert d["is_simulation_estimate"] is True
    assert d["disclaimer"] == SIMULATION_DISCLAIMER

    # 4. Summary table must identify outputs as simulation estimates
    summary_tbl = res.summary_table()
    assert "simulated_estimate" in summary_tbl.columns
    assert summary_tbl["is_simulation_estimate"].all() is np.bool_(True)


def test_econometric_behavior_directionality(engine):
    """Verify logical directional consistency of simulation models."""
    # 1. Price increase on price-sensitive item causes demand to drop
    p_inc_res = engine.simulate_increase_menu_price(item_id="ITEM-046", price_increase_pct=10.0)
    assert p_inc_res.demand["delta_units"] < 0

    # 2. Price reduction causes demand to rise
    p_red_res = engine.simulate_reduce_item_price(item_id="ITEM-063", price_reduction_pct=10.0)
    assert p_red_res.demand["delta_units"] > 0

    # 3. Reducing preparation quantity on high-wastage items reduces wastage cost
    prep_res = engine.simulate_reduce_preparation_quantity(prep_reduction_pct=20.0)
    assert prep_res.wastage["delta_cost"] < 0
    assert prep_res.profitability["delta_net_profit"] > 0

    # 4. Cold-chain wastage reduction directly improves net profitability
    waste_res = engine.simulate_change_wastage_assumptions(wastage_rate_change_pct=-25.0)
    assert waste_res.wastage["delta_cost"] < 0
    assert waste_res.profitability["delta_net_profit"] > 0


def test_benchmark_matrix_and_artifacts(engine):
    """Verify execution of standard benchmark and persistence of artifacts."""
    benchmark_df = engine.run_standard_scenario_benchmark()

    assert len(benchmark_df) == 8
    assert benchmark_df["is_simulation_estimate"].all() is np.bool_(True)
    assert (benchmark_df["disclaimer"] == SIMULATION_DISCLAIMER).all()

    # Run pipeline export
    bench_df, stats = run_what_if_pipeline()
    assert stats["total_scenarios_simulated"] == 8
    assert stats["is_simulation_estimate"] is True

    # Check Parquet and CSV files
    assert os.path.exists(os.path.join(OUTPUT_DIR, "what_if_scenario_benchmark.parquet"))
    assert os.path.exists(os.path.join(OUTPUT_DIR, "what_if_scenario_benchmark.csv"))

    # Check Report files
    assert os.path.exists(os.path.join(REPORTS_DIR, "what_if_scenario_report.md"))
    assert os.path.exists(os.path.join(REPORTS_DIR, "what_if_scenario_summary.json"))

    # Check report content contains disclaimer
    with open(os.path.join(REPORTS_DIR, "what_if_scenario_report.md"), "r", encoding="utf-8") as f:
        report_text = f.read()
    assert "MANDATORY SRS NOTICE: SIMULATED ESTIMATES ONLY" in report_text
