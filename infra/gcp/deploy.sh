#!/bin/bash
set -e

PREVIEW=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --preview) PREVIEW=true; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
done

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "No GCP project set. Run 'gcloud config set project [PROJECT_ID]' first."
    exit 1
fi

echo -e "\033[0;36mDeploying to project: $PROJECT_ID\033[0m"

if [ "$PREVIEW" = true ]; then
    echo -e "\033[1;33mRunning in Preview mode (Dry Run)\033[0m"
    docker build -t gcr.io/$PROJECT_ID/holokai-shell -f apps/shell/Dockerfile .
    docker build -t gcr.io/$PROJECT_ID/holokai-bff -f apps/bff/Dockerfile .
    docker build -t gcr.io/$PROJECT_ID/holokai-python-engine -f services/python-engine/Dockerfile services/python-engine
    echo -e "\033[0;32mDry run completed.\033[0m"
    exit 0
fi

echo -e "\033[0;36mSubmitting build to Cloud Build...\033[0m"
gcloud builds submit --config cloudbuild.yaml .
