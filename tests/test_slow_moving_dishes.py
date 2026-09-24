"""
Unit and Integration Tests for SRS Step 32: Slow-Moving Dish Detection
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
CUBE_PATH = os.path.join(PROJECT_ROOT, "processed_data", "joined", "master_analytical_cube", "master_analytical_cube.parquet")
WASTAGE_PATH = os.path.join(PROJECT_ROOT, "processed_data", "cleaned", "wastage", "wastage.parquet")

from python_pipeline.menu.slow_moving_dishes import (
    SlowMovingDishDetector,
    run_slow_moving_pipeline
)


@pytest.fixture(scope="module")
def menu_data():
    cube_df = pd.read_parquet(CUBE_PATH)
    wastage_df = pd.read_parquet(WASTAGE_PATH)
    return cube_df, wastage_df


def test_slow_moving_all_7_dimensions(menu_data):
    cube_df, wastage_df = menu_data
    detector = SlowMovingDishDetector(cube_df, wastage_df)
    df_dims = detector.compute_all_7_dimensions()

    assert len(df_dims) == 150

    # Dimension 1: Low sales volume
    assert "total_quantity_sold" in df_dims.columns
    assert (df_dims["total_quantity_sold"] > 0).all()

    # Dimension 2: Low purchase frequency
    assert "unique_order_count" in df_dims.columns
    assert (df_dims["unique_order_count"] > 0).all()

    # Dimension 3: Long gaps between purchases
    assert "mean_gap_days" in df_dims.columns
    assert "max_gap_days" in df_dims.columns
    assert (df_dims["mean_gap_days"] >= 0).all()

    # Dimension 4: Low repeat purchase
    assert "repeat_purchase_pct" in df_dims.columns
    assert (df_dims["repeat_purchase_pct"] >= 0).all()
    assert (df_dims["repeat_purchase_pct"] <= 100).all()

    # Dimension 5: High wastage
    assert "wasted_quantity" in df_dims.columns
    assert "wastage_percentage" in df_dims.columns
    assert (df_dims["wastage_percentage"] >= 0).all()

    # Dimension 6: Weak profitability
    assert "contribution_margin_pct" in df_dims.columns
    assert "profit_per_unit" in df_dims.columns

    # Dimension 7: Poor trend
    assert "normalized_trend_slope" in df_dims.columns
    assert "q4_vs_q1_growth_pct" in df_dims.columns


def test_slow_moving_scorecard_and_classes(menu_data):
    cube_df, wastage_df = menu_data
    detector = SlowMovingDishDetector(cube_df, wastage_df)
    scorecard = detector.compute_slow_moving_scorecard()

    assert len(scorecard) == 150
    assert "slow_moving_index" in scorecard.columns
    assert "movement_class" in scorecard.columns
    assert "recommended_action" in scorecard.columns

    # SMI must be bounded between 0 and 1
    assert scorecard["slow_moving_index"].min() >= 0.0
    assert scorecard["slow_moving_index"].max() <= 1.0

    # Ensure all classes are present
    classes = set(scorecard["movement_class"].unique())
    assert "Critical Slow-Moving" in classes
    assert "Moderate Slow-Moving" in classes
    assert "Active Mover" in classes


def test_slow_moving_pipeline_artifacts():
    scorecard_df, summary_stats = run_slow_moving_pipeline()

    assert summary_stats["total_dishes_evaluated"] == 150
    assert summary_stats["critical_slow_moving_count"] > 0
    assert summary_stats["total_wastage_loss_slow_moving"] > 0

    out_dir = os.path.join(PROJECT_ROOT, "processed_data", "slow_moving")
    rep_dir = os.path.join(PROJECT_ROOT, "reports", "slow_moving")

    assert os.path.exists(os.path.join(out_dir, "slow_moving_dishes.parquet"))
    assert os.path.exists(os.path.join(out_dir, "all_menu_items_movement_scorecard.parquet"))
    assert os.path.exists(os.path.join(rep_dir, "slow_moving_dishes_report.md"))
    assert os.path.exists(os.path.join(rep_dir, "slow_moving_dishes_report.json"))
