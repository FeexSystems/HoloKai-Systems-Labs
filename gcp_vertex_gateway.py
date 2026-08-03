"""
HoloKai GCP Vertex AI Gateway Module
Integrates Google Cloud Platform Vertex AI Gemini Models for HoloKai.
Target Project: third-glazing-k7c1c
Default Location: us-central1
"""

from __future__ import annotations

import logging
import os
import json
import urllib.request
import urllib.error
from typing import Any, Dict, List, Optional

logger = logging.getLogger("holokai.gcp.vertex")

GCP_PROJECT = os.getenv("GCP_PROJECT") or os.getenv("GOOGLE_CLOUD_PROJECT") or "third-glazing-k7c1c"
GCP_REGION = os.getenv("GCP_REGION") or os.getenv("GOOGLE_CLOUD_REGION") or "us-central1"
DEFAULT_VERTEX_MODEL = os.getenv("VERTEX_GEMINI_MODEL", "gemini-1.5-flash")


def get_gcp_access_token() -> Optional[str]:
    """Retrieve access token via gcloud CLI or environment."""
    token = os.getenv("GCP_ACCESS_TOKEN") or os.getenv("GOOGLE_BEARER_TOKEN")
    if token:
        return token.strip()

    # Try running gcloud CLI
    try:
        import subprocess
        gcloud_cmd = r"C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
        if not os.path.exists(gcloud_cmd):
            gcloud_cmd = "gcloud"
            
        result = subprocess.run(
            [gcloud_cmd, "auth", "print-access-token"],
            capture_output=True,
            text=True,
            check=True
        )
        t = result.stdout.strip()
        if t and not t.startswith("ERROR"):
            return t
    except Exception as exc:
        logger.debug("Failed to retrieve access token via gcloud CLI: %s", exc)

    return None


def get_vertex_status() -> Dict[str, Any]:
    """Return status of GCP Vertex AI configuration and authentication."""
    token = get_gcp_access_token()
    has_token = bool(token)
    return {
        "project_id": GCP_PROJECT,
        "region": GCP_REGION,
        "default_model": DEFAULT_VERTEX_MODEL,
        "authenticated": has_token,
        "auth_type": "Application Default Credentials (gcloud)" if has_token else "Unauthenticated",
    }


def synthesize_with_vertex_ai(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    temperature: float = 0.2,
) -> Dict[str, Any]:
    """
    Synthesize research query using Vertex AI Gemini API endpoint.
    """
    token = get_gcp_access_token()
    if not token:
        raise RuntimeError(
            "GCP Vertex AI authentication failed. Run `gcloud auth application-default login` or set GCP_ACCESS_TOKEN."
        )

    target_model = model or DEFAULT_VERTEX_MODEL
    url = (
        f"https://{GCP_REGION}-aiplatform.googleapis.com/v1/projects/{GCP_PROJECT}/"
        f"locations/{GCP_REGION}/publishers/google/models/{target_model}:generateContent"
    )

    # Format messages into Vertex AI contents structure
    contents = []
    system_instruction = None

    for msg in messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")

        if role == "system":
            system_instruction = {"parts": [{"text": content}]}
        else:
            v_role = "model" if role in ("assistant", "model") else "user"
            contents.append({"role": v_role, "parts": [{"text": content}]})

    payload: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": 2048,
        },
    }
    if system_instruction:
        payload["systemInstruction"] = system_instruction

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            resp_body = resp.read().decode("utf-8")
            res_json = json.loads(resp_body)

        candidates = res_json.get("candidates") or []
        if not candidates:
            raise RuntimeError("Vertex AI returned response with no candidates")

        parts = candidates[0].get("content", {}).get("parts") or []
        answer = "".join([p.get("text", "") for p in parts]).strip()

        if not answer:
            raise RuntimeError("Vertex AI returned empty answer content")

        return {
            "answer": answer,
            "provider": "vertex_ai",
            "model": target_model,
            "project": GCP_PROJECT,
            "region": GCP_REGION,
        }

    except urllib.error.HTTPError as err:
        err_msg = err.read().decode("utf-8") if err.fp else str(err)
        raise RuntimeError(f"Vertex AI HTTP {err.code} Error: {err_msg}") from err
    except Exception as exc:
        raise RuntimeError(f"Vertex AI request failed: {exc}") from exc
