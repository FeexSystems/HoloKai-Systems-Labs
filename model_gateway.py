from __future__ import annotations

import os
from typing import Any, Dict, List


def _build_messages(query: str, contexts: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    evidence = []
    for i, ctx in enumerate(contexts[:10], start=1):
        title = (
            ctx.get("title")
            or (ctx.get("metadata") or {}).get("title")
            or (ctx.get("metadata") or {}).get("source")
            or "Source"
        )
        content = (ctx.get("content") or ctx.get("text") or "").strip()
        evidence.append(f"[{i}] {title}\n{content[:1200]}")

    system = (
        "You are HoloKai research synthesis. Use only provided evidence blocks. "
        "If evidence is insufficient, explicitly say so. Keep claims precise and traceable."
    )
    evidence_text = "\n\n".join(evidence) if evidence else "[none]"
    user = (
        f"Question: {query}\n\n"
        "Evidence blocks:\n"
        f"{evidence_text}\n\n"
        "Return a concise synthesis and call out uncertainty or contested points."
    )

    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]


def _extract_message_content(message: Any) -> str:
    content = getattr(message, "content", "")
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            if isinstance(item, dict):
                txt = item.get("text")
                if isinstance(txt, str):
                    parts.append(txt)
            elif isinstance(item, str):
                parts.append(item)
        return "\n".join(parts).strip()
    return str(content or "").strip()


def _get_openai_client(api_key: str, base_url: str | None = None):
    from openai import OpenAI
    import httpx
    return OpenAI(api_key=api_key, base_url=base_url, http_client=httpx.Client())


def _hosted_synthesize(messages: List[Dict[str, str]], model: str | None = None) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("No Gemini API key configured (GEMINI_API_KEY / GOOGLE_API_KEY)")

    base_url = os.getenv("GEMINI_BASE_URL") or "https://generativelanguage.googleapis.com/v1beta/openai/"
    hosted_model = model or os.getenv("GEMINI_MODEL") or "gemini-1.5-flash"

    client = _get_openai_client(api_key=api_key, base_url=base_url)
    response = client.chat.completions.create(
        model=hosted_model,
        messages=messages,
        temperature=0.2,
    )
    answer = _extract_message_content(response.choices[0].message)
    if not answer:
        raise RuntimeError("Gemini model returned an empty answer")

    return {
        "answer": answer,
        "provider": "gemini",
        "model": hosted_model,
        "host": base_url,
    }


def synthesize_with_gateway(
    *,
    query: str,
    contexts: List[Dict[str, Any]],
    prefer_hosted: bool = True,
    hosted_model: str | None = None,
    ollama_model: str | None = None,
) -> Dict[str, Any]:
    messages = _build_messages(query, contexts)
    return _hosted_synthesize(messages, model=hosted_model)

