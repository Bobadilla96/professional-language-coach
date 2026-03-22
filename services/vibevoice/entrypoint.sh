#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
MODEL_PATH="${VIBEVOICE_MODEL_PATH:-microsoft/VibeVoice-Realtime-0.5B}"
DEVICE="${VIBEVOICE_DEVICE:-cuda}"
RELOAD="${VIBEVOICE_RELOAD:-0}"

args=(python demo/vibevoice_realtime_demo.py --port "$PORT" --model_path "$MODEL_PATH" --device "$DEVICE")

if [[ "$RELOAD" == "1" ]]; then
  args+=(--reload)
fi

echo "[vibevoice] starting realtime demo on port ${PORT} using ${DEVICE} and model ${MODEL_PATH}"
exec "${args[@]}"
