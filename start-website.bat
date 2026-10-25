@echo off
echo ========================================================
echo   Starting SMCP Model United Nations Local Preview
echo ========================================================
echo Website running at http://localhost:8000
start "" "http://localhost:8000"
python -m http.server 8000
