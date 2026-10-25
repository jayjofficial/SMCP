@echo off
echo ========================================================
echo   Starting Sovereign Multilateral Conference of the Parties - MUN Local Preview
echo ========================================================
echo Website running at http://localhost:8000
start "" "http://localhost:8000"
python -m http.server 8000
