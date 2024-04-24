# RotorWind GmbH Production Plant Monitoring POC
Case-Study @ IUBH

# Used Components
- Prometheus
- Alert-Manager
- Grafana
- Temperaturecontroller Emulator

# Prerequisites

- Docker / Podman

# Getting Started

1. Switch to Folder "environment"
2. Execute "docker-compose up -d"
3. Access Grafana at "http://localhost:3000" with Password "9uT46ZKE" -> Change in "config.monitoring".
4. Access Prometheus at "http://localhost:9090"

# Development

- Software-Sensor emulation code at "software-sensor/software-sensor.js"