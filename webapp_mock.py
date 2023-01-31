import random
import uvicorn
import traceback
from typing import List
from fastapi import FastAPI
from jose import JWTError, jwt
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

# from utilities.logger import get_logger


# _logger = get_logger('abt_apis')


app = FastAPI()


origins = [
    "*",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewScan(BaseModel):
    user: str
    scan_station: int
    code: str

class Envelope(BaseModel):
    user: str
    scan_station: int
    codes: List[str]

class Bucket(BaseModel):
    user: str
    scan_station: int
    bucket: str

class Pallet(BaseModel):
    user: str
    pallet_id: str
    shippers: List[str]

class Token(BaseModel):
    token:str


ALPHABETS = [chr(c) for c in range(ord('a'), ord('z')+1)]

BUCKETS = ['B3', 'BP', 'RG', 'RA', 'RB', 'RC', 'RH', 'RF', 'RE', 'RD', 'LH', 'LF', 'LE', 'LD', 'LG', 'LA', 'LB', 'LC']


def random_str():
    return ''.join(random.choices(ALPHABETS, k=5))


def get_env_counts():
    env_counts = {
        b: random.randint(5, 10)
        for b in BUCKETS
    }
    return env_counts
@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your blog!."}

@app.get("/api/hello")
async def root():
    return {"message": "Hello World"}

@app.post("/api/token")
async def token(token:Token):
    res = jwt.decode("eyJhbGciOiJSUzI1NiIsImtpZCI6ImFmYzRmYmE2NTk5ZmY1ZjYzYjcyZGM1MjI0MjgyNzg2ODJmM2E3ZjEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzUxMzczMDMsImF1ZCI6IjEyNDY3Njc1MzY1NS1qaWs5NWY0OGxsdWtzamh0MGk0Zmw5cmM5OGpudHA4NS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMDQwNzk3ODA4OTY5NTE1MzI3MSIsImVtYWlsIjoia2lsbGVycmFtcGFnZTAxMDVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjEyNDY3Njc1MzY1NS1qaWs5NWY0OGxsdWtzamh0MGk0Zmw5cmM5OGpudHA4NS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJUb3AgUEFMIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FFZEZUcDZLSExLMG13dTZyLWdNNG12bTYyb3Z6NHdxZ2FfT3loTmMzLXFSPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlRvcCIsImZhbWlseV9uYW1lIjoiUEFMIiwiaWF0IjoxNjc1MTM3NjAzLCJleHAiOjE2NzUxNDEyMDMsImp0aSI6ImNjZjNkOGVlNDk0NzNkNzhkMDdlNWVkNDQ3MTNhYThiZmFiOWViYTIifQ.O3RCYUx2DDdp6dPkvCEpSYes8mr4oZ_IUmdtWjOYbFQaTQ0XSfVVOP5D7zxU4CqbRSQxcNz9kRbyUgD26WFcWWABK0ztIJy2dY9cbKV2z1SfEtqNM_ccchrIVzFVJ41qBRomQdMiIuel0cAcioSnp-9q__7MMj3adTeu8Yw2hs_q-qFr3NEyhWqQ5hTfrgcgEM0-TzGIkblmNOgOoZc9p42Ei-DZpEB-Z3F-m3zg60k6WCUCnokHBBvPNCOm4PY9z7yh0xJ5bEyk7GksQog_qHiereYKzpWt_DkTwd7UVkRjqVmDHLE6WAOeKAuuwNRRMFVosJZFq0edqOvWEryyZw", 'secret', algorithms=['HS256']) 
    return {"message": res}

@app.post("/api/add_code")
async def add_code(scan: NewScan):
    # _logger.info(scan)
    if scan.code:
        n = random.choices([1, 2, 3], weights=[0.75, 0.2, .05], k=1)[0]
        return [f'{scan.code} {random_str()}' for i in range(n)]
    return []


@app.post("/api/add_envelope")
async def add_envelope(envelope: Envelope):
    # _logger.info(envelope)
    response = {"bucket": random.choice(BUCKETS)}
    env_counts = get_env_counts()
    response.update(env_counts)
    return response


@app.post("/api/close_shipper")
async def close_shipper(bucket: Bucket):
    # _logger.info(bucket)
    try:
        if bucket.bucket:
            env_counts = get_env_counts()
            env_counts[bucket.bucket] = 0
            return env_counts
        return {'msg': 'No valid bucket found'}
    except:
        return {'msg': traceback.format_exc()}


@app.post("/api/add_to_pallet")
async def add_to_pallet(pallet: Pallet):
    # _logger.info(pallet)
    msg_err = "This shipper has not been closed or has been aggregated already"
    msg_succ = "Shipper closed successfully"
    msg = random.choices([msg_succ, msg_err], weights=[0.8, 0.2], k=1)[0]
    return {"msg": msg}  # , "details": ["these are", "three lines", "of details"]}


@app.post("/api/get_shippers")
async def get_shippers():
    return {"shippers": ["abc", "def", "ghi", "jkl", "mno"]}


@app.post("/api/agg_shipper")
async def agg_shipper(scan: NewScan):
    # _logger.info(scan)
    failed = {
        "bucket": "",
        "count": "",
        "batch": "",
        "msg": f"{scan.code} is not closed. Aggregation failed"
    }
    succ = {
        "bucket": random.choice(BUCKETS),
        "count": random.choice(["78", "42", "88", "49"]),
        "batch": random.choice(["ABS123", "GHF102"]),
        "msg": "Shipper Aggregated"
    }
    if random.randint(0, 10) > 6:
        return failed
    return succ


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8125)

