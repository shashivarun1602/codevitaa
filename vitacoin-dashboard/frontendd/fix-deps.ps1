# Fix React Dependencies Script
Write-Host "Fixing React dependencies..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location "c:\Users\nalla\OneDrive\Desktop\vottacoin\codevitaa\vitacoin-dashboard\frontendd"

# Remove existing dependencies
Write-Host "Removing existing node_modules and package-lock.json..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install dependencies with exact versions
Write-Host "Installing React dependencies..." -ForegroundColor Yellow
npm install react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1 react-router-dom@6.8.1 --save --legacy-peer-deps

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
npm start

Write-Host "Setup complete!" -ForegroundColor Green
