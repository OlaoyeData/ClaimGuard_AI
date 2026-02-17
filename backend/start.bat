@echo off
echo Installing Python dependencies...
cd /d "%~dp0"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo.
echo Starting FastAPI server...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
