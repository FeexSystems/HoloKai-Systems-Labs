"""
HoloKai Google Cloud Storage (GCS) Vector Sync Module
Manages vector dataset backup and sync to GCS bucket.
Project: third-glazing-k7c1c
Bucket: third-glazing-k7c1c-holokai-vectors
"""

from __future__ import annotations

import logging
import os
import json
import urllib.request
import urllib.error
from typing import Any, Dict, Optional
from gcp_vertex_gateway import get_gcp_access_token, GCP_PROJECT

logger = logging.getLogger("holokai.gcp.gcs")

GCS_BUCKET_NAME = os.getenv("GCS_VECTOR_BUCKET", "gen-lang-client-0948281794-holokai-vectors")
LOCAL_VECTORS_PATH = os.path.join(
    os.path.dirname(__file__), "frontend", ".data", "holokai-vectors.json"
)


def get_gcs_status() -> Dict[str, Any]:
    """Return GCS vector bucket configuration and sync readiness."""
    token = get_gcp_access_token()
    local_exists = os.path.exists(LOCAL_VECTORS_PATH)
    file_size_mb = (
        round(os.path.getsize(LOCAL_VECTORS_PATH) / (1024 * 1024), 2)
        if local_exists
        else 0
    )

    return {
        "project_id": GCP_PROJECT,
        "bucket_name": GCS_BUCKET_NAME,
        "authenticated": bool(token),
        "local_vectors_file": LOCAL_VECTORS_PATH,
        "local_vectors_exists": local_exists,
        "local_vectors_size_mb": file_size_mb,
    }


def upload_vectors_to_gcs() -> Dict[str, Any]:
    """Upload local holokai-vectors.json inventory to GCS bucket."""
    token = get_gcp_access_token()
    if not token:
        raise RuntimeError(
            "GCS Authentication failed. Run `gcloud auth application-default login` or set GCP_ACCESS_TOKEN."
        )

    if not os.path.exists(LOCAL_VECTORS_PATH):
        raise RuntimeError(f"Local vectors file not found at: {LOCAL_VECTORS_PATH}")

    with open(LOCAL_VECTORS_PATH, "rb") as f:
        file_bytes = f.read()

    file_size_mb = round(len(file_bytes) / (1024 * 1024), 2)
    object_name = "holokai-vectors.json"

    # Use GCS JSON API endpoint
    url = (
        f"https://storage.googleapis.com/upload/storage/v1/b/{GCS_BUCKET_NAME}/"
        f"o?uploadType=media&name={object_name}"
    )

    req = urllib.request.Request(
        url,
        data=file_bytes,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            resp_body = resp.read().decode("utf-8")
            res_json = json.loads(resp_body)

        return {
            "status": "SUCCESS",
            "bucket": GCS_BUCKET_NAME,
            "object": object_name,
            "size_mb": file_size_mb,
            "gcs_link": res_json.get("mediaLink") or f"gs://{GCS_BUCKET_NAME}/{object_name}",
            "crc32c": res_json.get("crc32c"),
        }

    except urllib.error.HTTPError as err:
        err_msg = err.read().decode("utf-8") if err.fp else str(err)
        # If bucket does not exist, return clear diagnostic info
        if err.code == 404:
            raise RuntimeError(
                f"GCS Bucket gs://{GCS_BUCKET_NAME} not found. Create it using `gcloud storage buckets create gs://{GCS_BUCKET_NAME} --project={GCP_PROJECT}`"
            ) from err
        raise RuntimeError(f"GCS Upload HTTP {err.code} Error: {err_msg}") from err
    except Exception as exc:
        raise RuntimeError(f"GCS Upload failed: {exc}") from exc
