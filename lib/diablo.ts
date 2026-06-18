// DIABLO — Raghavendra's personal AI agent, hosted on Hugging Face Spaces.
// Configurable per-environment; falls back to the deployed Space so the site
// works with zero config. Set NEXT_PUBLIC_DIABLO_URL to point elsewhere.
export const DIABLO_URL =
  process.env.NEXT_PUBLIC_DIABLO_URL ?? "https://raghav-1729-diablo-ai-agent.hf.space";
