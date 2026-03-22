# VibeVoice service

This folder keeps the VibeVoice runtime in the same repository as the Next.js app, but it is meant to be deployed as a separate service.

## Why this is separate from Vercel

`professional-language-coach` runs well on Vercel, but Microsoft VibeVoice is a realtime inference service. It needs a long-running process and, in practice, a GPU-backed host.

That means:
- same repository: yes
- same web app deploy on Vercel: no
- separate runtime/service: yes

## What this service exposes

The frontend already consumes these endpoints:
- `GET /config`
- `WS /stream`

Those are provided by the official Microsoft demo server started through `demo/vibevoice_realtime_demo.py`.

## Local GPU run with Docker Compose

Requirements:
- Docker Engine / Docker Desktop
- NVIDIA Container Toolkit
- a machine with compatible GPU

From this folder:

```bash
docker compose -f docker-compose.gpu.yml up --build
```

The service will be available at:

```bash
http://localhost:8000
```

## Deploy on a separate host

You can deploy this exact folder to any GPU-capable host:
- RunPod
- Vast.ai
- Paperspace
- a VM with NVIDIA GPU
- your own on-prem server

Build example:

```bash
docker build -t vibevoice-service ./services/vibevoice
```

Run example:

```bash
docker run --gpus all -p 8000:8000 \
  -e PORT=8000 \
  -e VIBEVOICE_MODEL_PATH=microsoft/VibeVoice-Realtime-0.5B \
  -e VIBEVOICE_DEVICE=cuda \
  -e HF_HOME=/data/hf \
  vibevoice-service
```

## Connect the web app

In the Next.js app environment:

```bash
VIBEVOICE_BASE_URL=https://your-vibevoice-host.example.com
NEXT_PUBLIC_VIBEVOICE_BASE_URL=https://your-vibevoice-host.example.com
```

Then redeploy the web app.

## Notes

- The Docker image clones the official Microsoft repository during build.
- Default model: `microsoft/VibeVoice-Realtime-0.5B`
- Default device: `cuda`
- CPU mode is technically possible by changing `VIBEVOICE_DEVICE=cpu`, but it is not a practical production target.
