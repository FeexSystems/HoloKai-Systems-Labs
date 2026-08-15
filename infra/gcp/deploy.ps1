param (
    [switch]$Preview = $false
)

$PROJECT_ID = gcloud config get-value project
if (-not $PROJECT_ID) {
    Write-Error "No GCP project set. Run 'gcloud config set project [PROJECT_ID]' first."
    exit 1
}

Write-Host "Deploying to project: $PROJECT_ID" -ForegroundColor Cyan

if ($Preview) {
    Write-Host "Running in Preview mode (Dry Run)" -ForegroundColor Yellow
    # Just run a local docker build to verify
    docker build -t gcr.io/$PROJECT_ID/holokai-shell -f apps/shell/Dockerfile .
    docker build -t gcr.io/$PROJECT_ID/holokai-bff -f apps/bff/Dockerfile .
    docker build -t gcr.io/$PROJECT_ID/holokai-python-engine -f services/python-engine/Dockerfile services/python-engine
    Write-Host "Dry run completed." -ForegroundColor Green
    exit 0
}

Write-Host "Submitting build to Cloud Build..." -ForegroundColor Cyan
gcloud builds submit --config cloudbuild.yaml .
