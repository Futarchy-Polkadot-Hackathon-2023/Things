@echo off
setlocal enableextensions

if not "%SWANKY_REDIRECTED%"=="1" if exist "%LOCALAPPDATA%\swanky\client\bin\swanky.cmd" (
  set SWANKY_REDIRECTED=1
  "%LOCALAPPDATA%\swanky\client\bin\swanky.cmd" %*
  goto:EOF
)

if not defined SWANKY_BINPATH set SWANKY_BINPATH="%~dp0swanky.cmd"
if exist "%~dp0..\bin\node.exe" (
  "%~dp0..\bin\node.exe" "%~dp0..\bin\run" %*
) else if exist "%LOCALAPPDATA%\oclif\node\node-18.2.0.exe" (
  "%LOCALAPPDATA%\oclif\node\node-18.2.0.exe" "%~dp0..\bin\run" %*
) else (
  node "%~dp0..\bin\run" %*
)
