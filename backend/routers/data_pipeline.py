"""
DineIQ Analytics — Data Pipeline Upload & Analyze REST API
Evaluator-friendly extension around the Big Data Spark ingestion and analytics capabilities.

Supports:
- Multi-file drag & drop uploads (CSV, JSON, Parquet)
- Dataset type & schema auto-detection
- Explicit PySpark StructType validation
- SRS Data Quality rule audits
- Real data cleaning with quarantine isolation
- Relational integrity & orphan detection
- Analytical intelligence & ML predictions
- Markdown report and CSV exports
"""

import os
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Query, Response, status
from fastapi.responses import PlainTextResponse, FileResponse
from pydantic import BaseModel

from backend.services.pipeline_runner import PipelineRunner

router = APIRouter(prefix="/api/v1/data-pipeline", tags=["Data Pipeline — Upload & Analyze"])
runner = PipelineRunner()


@router.get("/runs", summary="List all upload and analysis execution runs")
def get_runs_history():
    """Retrieve run history for the Upload & Analysis dashboard."""
    return {"runs": runner.list_runs()}


@router.post("/upload", status_code=status.HTTP_201_CREATED, summary="Upload raw restaurant datasets")
async def upload_datasets(
    files: List[UploadFile] = File(...),
    uploaded_by: Optional[str] = Query("evaluator")
):
    """
    Accepts CSV, JSON, and Parquet files into an isolated staging directory.
    Validates file extensions and sizes, profiles row/column counts, and detects entity types.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")

    # Initialize new isolated run
    run_id = runner.initialize_run(uploaded_by=uploaded_by)
    staged_results = []

    for f in files:
        # Validate format
        ext = os.path.splitext(f.filename)[1].lower()
        if ext not in [".csv", ".json", ".parquet", ".pq"]:
            continue

        content = await f.read()
        # 100MB limit check
        if len(content) > 100 * 1024 * 1024:
            raise HTTPException(status_code=413, detail=f"File '{f.filename}' exceeds 100 MB limit.")

        info = runner.stage_file(run_id, f.filename, content)
        staged_results.append(info)

    if not staged_results:
        raise HTTPException(status_code=400, detail="No supported CSV, JSON, or Parquet files could be staged.")

    return {
        "run_id": run_id,
        "message": f"Successfully staged {len(staged_results)} files into isolated run.",
        "files": staged_results,
        "total_records": sum(f["rows"] for f in staged_results)
    }


@router.post("/demo", status_code=status.HTTP_201_CREATED, summary="Quick Evaluator Demo Run")
def create_demo_run(sample_size: int = Query(5000, description="Records per demo dataset")):
    """
    Evaluator convenience shortcut: Instantly loads sample datasets from project data
    into a fresh run so the evaluator can test the 6-stage wizard without searching for files.
    """
    run_id = runner.initialize_run(uploaded_by="Evaluator Demo")
    staged = runner.stage_demo_datasets(run_id, sample_limit=sample_size)
    return {
        "run_id": run_id,
        "message": f"Created Evaluator Demo Run with {len(staged)} staged datasets ({sum(f['rows'] for f in staged):,} records).",
        "files": staged
    }


@router.get("/runs/{run_id}", summary="Get run execution state and manifest")
def get_run_manifest(run_id: str):
    """Returns current stage and details of a run."""
    try:
        return runner.get_run_details(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.post("/runs/{run_id}/validate-schema", summary="Execute Step 2: PySpark Schema Validation")
def validate_schema(run_id: str):
    """Runs explicit StructType schema validation and cross-table PK/FK orphan detection."""
    try:
        return runner.validate_schema(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.post("/runs/{run_id}/data-quality", summary="Execute Step 3: SRS Data Quality Audit")
def check_data_quality(run_id: str):
    """Runs applicable SRS data quality audit rules and counts violations."""
    try:
        return runner.check_data_quality(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.post("/runs/{run_id}/clean", summary="Execute Step 4 & 5: PySpark Data Cleaning")
def clean_data(run_id: str):
    """Executes data cleaning rules, calculates BEFORE/AFTER metrics, and generates evidence log."""
    try:
        return runner.run_cleaning(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.post("/runs/{run_id}/process", summary="Execute Step 6: PySpark Relational Integration")
def process_data(run_id: str):
    """Executes PySpark relational joins and generates master analytical order cube in Parquet."""
    try:
        return runner.process_with_pyspark(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.post("/runs/{run_id}/analyze", summary="Execute Step 8: Multi-dimensional Analytics & ML")
def analyze_data(run_id: str):
    """Executes sales, menu, customer, wastage, forecast, anomalies, and ML inference."""
    try:
        return runner.run_analytics_and_ml(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.get("/runs/{run_id}/results", summary="Get complete analysis dashboard results")
def get_analysis_results(run_id: str):
    """Returns analytics payload for the Results dashboard."""
    paths = runner._get_run_paths(run_id)
    results_path = os.path.join(paths["results"], "analytics_results.json")
    if not os.path.exists(results_path):
        # If not analyzed yet, run it on demand
        return runner.run_analytics_and_ml(run_id)
    with open(results_path, "r", encoding="utf-8") as f:
        import json
        return json.load(f)


@router.get("/runs/{run_id}/report", response_class=PlainTextResponse, summary="Download Markdown Analysis Report")
def download_report(run_id: str):
    """Generates an executive analysis report in Markdown format."""
    try:
        md = runner.generate_markdown_report(run_id)
        return PlainTextResponse(content=md, media_type="text/markdown")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.get("/runs/{run_id}/export/{dataset_name}", summary="Export cleaned dataset as CSV")
def export_cleaned_dataset(run_id: str, dataset_name: str):
    """Allows downloading cleaned datasets as CSV."""
    paths = runner._get_run_paths(run_id)
    csv_file = os.path.join(paths["cleaned"], f"{dataset_name}.csv")
    if not os.path.exists(csv_file):
        raise HTTPException(status_code=404, detail=f"Cleaned dataset '{dataset_name}' not found for run '{run_id}'.")
    return FileResponse(csv_file, media_type="text/csv", filename=f"{run_id}_{dataset_name}_cleaned.csv")
