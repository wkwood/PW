# start_mongo.ps1
# This script starts a MongoDB container for the F1 BOM project.

$containerName = "f1-mongo"
$imageName = "mongo:latest"
$port = "27017"

# 1. Check if Docker is running
docker info >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker Desktop is not running. Please start it and try again."
    exit $LASTEXITCODE
}

# 2. Check if container already exists
$containerId = docker ps -a -q -f "name=$containerName"

if ($containerId) {
    # 3. If exists, check if it's running
    $isRunning = docker ps -q -f "id=$containerId"
    if ($isRunning) {
        Write-Host "Container '$containerName' is already running." -ForegroundColor Cyan
    }
    else {
        Write-Host "Starting existing container '$containerName'..." -ForegroundColor Yellow
        docker start $containerId
    }
}
else {
    # 4. If doesn't exist, pull and run new container
    Write-Host "Creating and starting new MongoDB container '$containerName' on port $port..." -ForegroundColor Green
    docker run --name $containerName -p "${port}:27017" -d $imageName
}

Write-Host "MongoDB is now available at mongodb://localhost:$port" -ForegroundColor Green
