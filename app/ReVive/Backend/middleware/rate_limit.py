import time
from collections import defaultdict
from fastapi import Request, HTTPException

class RateLimiter:
    def __init__(self):
        self._requests: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str, max_requests: int, window_seconds: int) -> None:
        now = time.time()
        self._requests[key] = [
            t for t in self._requests[key] if now - t < window_seconds
        ]
        if len(self._requests[key]) >= max_requests:
            retry_after = int(window_seconds - (now - self._requests[key][0]))
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Try again in {retry_after}s",
                headers={"Retry-After": str(retry_after)},
            )
        self._requests[key].append(now)

    def cleanup(self, max_age: int = 300) -> None:
        now = time.time()
        empty_keys = [
            k for k, v in self._requests.items()
            if not v or now - v[-1] > max_age
        ]
        for k in empty_keys:
            del self._requests[k]

rate_limiter = RateLimiter()
