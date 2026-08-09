import os
import httpx

class WolframCompute:
    """
    Deterministic computation boundary for HoloKai Oracle Backend.
    Historical premises remain HoloKai evidence; Wolfram provides quantitative calculations.
    """
    def __init__(self):
        self.app_id = os.getenv("WOLFRAM_APP_ID")
        self.base_url = "https://api.wolframalpha.com/v2/query"

    async def query(self, natural_language_query: str):
        if not self.app_id:
            return {
                "status": "not_configured",
                "query": natural_language_query,
                "note": "WOLFRAM_APP_ID environment variable not set. Client fallback active."
            }
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                self.base_url,
                params={"appid": self.app_id, "input": natural_language_query, "output": "json"},
            )
            r.raise_for_status()
            return r.json()

    def capability_map(self):
        return {
            "chronology": ["date arithmetic", "intervals", "calendar conversions"],
            "geography": ["distance", "bearing", "coordinate normalization"],
            "astronomy": ["planetary positions", "rise/set", "astronomical calculations"],
            "quantitative": ["ratios", "statistics", "unit conversions"],
            "graph": ["centrality", "paths", "network measures"],
            "symbolic": ["algebra", "equations", "formal transformations"],
        }
