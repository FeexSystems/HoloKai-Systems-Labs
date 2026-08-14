# Planetary UI Platform — Terraform Infrastructure Module
# Configures Cloudflare Edge Workers, DNS, and Self-Hosted Kubernetes (K3s/MetalLB) Cluster Infrastructure.

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare Zone ID for holokai.systems domain"
  default     = "0123456789abcdef0123456789abcdef"
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare Account ID"
  default     = "abcdef0123456789abcdef0123456789"
}

# Cloudflare Geo Router Worker Script Deployment
resource "cloudflare_worker_script" "geo_router" {
  account_id = var.cloudflare_account_id
  name       = "holokai-geo-router"
  content    = file("${path.module}/../../edge/geo-router-worker/src/index.ts")
  module     = true
}

# Cloudflare Worker Domain Route Binding
resource "cloudflare_worker_route" "geo_router_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "holokai.systems/*"
  script_name = cloudflare_worker_script.geo_router.name
}

output "geo_router_worker_name" {
  value = cloudflare_worker_script.geo_router.name
}
