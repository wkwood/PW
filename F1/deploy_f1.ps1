# F1 BOM Schema Deployment Script
# Targets: Localhost MongoDB instance, Database: "F1"

$mongoHost = "localhost"
$mongoPort = "27017"
$dbName = "F1"
$scriptPath = "setup_f1_schema.js"

Write-Host "--- F1 BOM Schema Deployment ---" -ForegroundColor Cyan
Write-Host "Target: mongodb://$($mongoHost):$($mongoPort)/$($dbName)"

# Check if mongosh is installed
if (!(Get-Command mongosh -ErrorAction SilentlyContinue)) {
    Write-Error "mongosh not found. Please install MongoDB Shell to run this deployment."
    exit 1
}

# Run the deployment
Write-Host "Executing $($scriptPath)..."
& mongosh "mongodb://$($mongoHost):$($mongoPort)/$($dbName)" $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully installed F1 BOM Schema." -ForegroundColor Green
} else {
    Write-Error "Deployment failed. Check the output above."
}
