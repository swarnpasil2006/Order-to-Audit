@echo off
title NIT Tiruchirappalli Internship Task - GitHub Submission
color 0A
cls
echo ======================================================================
echo    Centre for Digital Infrastructure, NIT Tiruchirappalli
echo    Order-to-Audit ERP - Public GitHub Repository Publisher
echo ======================================================================
echo.
echo This script will push your complete project and commit history to your
echo public GitHub repository for submission.
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/nit-order-to-audit.git): "
if "%REPO_URL%"=="" goto error

echo.
echo [1/3] Configuring remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Setting branch to main...
git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  SUCCESS! Your repository has been published to GitHub.
    echo  Submit your repository URL: %REPO_URL%
    echo ======================================================================
) else (
    echo.
    echo Push encountered an issue. Ensure you are signed into Git and
    echo that the repository exists on GitHub.
)
pause
exit /b 0

:error
echo Error: Repository URL cannot be blank.
pause
