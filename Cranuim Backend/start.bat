@echo off
title Cranium Backend
echo Starting Cranium...
echo Checking for dependencies...
if not exist "node_modules" (
    echo Dependencies not found. Run install-packages.bat first.
    pause
    exit
)
node index.js
pause
