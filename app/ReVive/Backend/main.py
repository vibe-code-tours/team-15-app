from fastapi import FastAPI

app = FastAPI(title="ReVive API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the ReVive Backend API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
