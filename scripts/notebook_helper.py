"""
Helper module for programmatic Jupyter notebook generation and execution
for DineIQ Analytics project.
"""
import os
import sys
import nbformat as nbf
from nbclient import NotebookClient

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
NOTEBOOKS_DIR = os.path.join(PROJECT_ROOT, "notebooks")
os.makedirs(NOTEBOOKS_DIR, exist_ok=True)


def create_base_notebook(title: str, objective: str, srs_req: str, dataset_used: str):
    """Creates a notebook with standardized metadata and SRS header cell."""
    nb = nbf.v4.new_notebook()
    nb.metadata = {
        "kernelspec": {
            "display_name": "Python 3 (ipykernel)",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "name": "python",
            "version": "3.14.3"
        }
    }

    header_md = f"""# {title}

**Objective:** {objective}  
**Related SRS Requirement:** {srs_req}  
**Dataset / Source Used:** {dataset_used}  
**Author:** DineIQ Big Data & Data Science Engineering Team  

---
"""
    nb.cells.append(nbf.v4.new_markdown_cell(header_md))
    return nb


def add_markdown(nb, text: str):
    """Appends a markdown cell."""
    nb.cells.append(nbf.v4.new_markdown_cell(text.strip()))


def add_code(nb, code: str):
    """Appends a code cell."""
    nb.cells.append(nbf.v4.new_code_cell(code.strip()))


def save_and_execute_notebook(nb, filename: str, timeout: int = 180):
    """Saves and executes the notebook, recording all outputs and figures."""
    filepath = os.path.join(NOTEBOOKS_DIR, filename)
    print(f"Executing and saving notebook: {filename}...")
    
    # Save unexecuted first
    with open(filepath, "w", encoding="utf-8") as f:
        nbf.write(nb, f)

    try:
        client = NotebookClient(nb, timeout=timeout, kernel_name="python3", resources={"metadata": {"path": NOTEBOOKS_DIR}})
        client.execute()
        # Save executed notebook
        with open(filepath, "w", encoding="utf-8") as f:
            nbf.write(nb, f)
        print(f"  [SUCCESS] {filename} executed with {len(nb.cells)} cells.")
    except Exception as e:
        print(f"  [WARNING] Execution had an issue for {filename}: {e}")
        # Write anyway so notebook file exists with cells
        with open(filepath, "w", encoding="utf-8") as f:
            nbf.write(nb, f)
    return filepath
