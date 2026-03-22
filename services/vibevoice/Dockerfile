FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04

ARG DEBIAN_FRONTEND=noninteractive
ARG VIBEVOICE_REPO_REF=main

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH=/opt/venv/bin:$PATH \
    HF_HOME=/data/hf \
    PORT=8000 \
    VIBEVOICE_MODEL_PATH=microsoft/VibeVoice-Realtime-0.5B \
    VIBEVOICE_DEVICE=cuda

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    git \
    libsndfile1 \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv ${VIRTUAL_ENV}

WORKDIR /opt
RUN git clone --depth 1 --branch ${VIBEVOICE_REPO_REF} https://github.com/microsoft/VibeVoice.git /opt/vibevoice

WORKDIR /opt/vibevoice
RUN pip install --upgrade pip setuptools wheel && \
    pip install -e .[streamingtts]

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 CMD python3 - <<'PY'
import json
import sys
import urllib.request

try:
    with urllib.request.urlopen('http://127.0.0.1:8000/config', timeout=5) as response:
        payload = json.loads(response.read().decode('utf-8'))
        if response.status == 200 and 'voices' in payload:
            sys.exit(0)
except Exception:
    pass
sys.exit(1)
PY

ENTRYPOINT ["/entrypoint.sh"]
