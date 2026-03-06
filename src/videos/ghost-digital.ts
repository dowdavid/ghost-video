import type { VideoConfig } from "../lib/types";

export const ghostDigital: VideoConfig = {
  id: "GhostDigital",
  width: 1920,
  height: 1080,
  fps: 30,
  music: {
    src: "sigmamusicart-no-copyright-music-446509.mp3",
    startFrom: 325,
    volume: 0.6,
  },
  scenes: [
    {
      type: "logo-reveal",
      variant: "wordmark",
      durationInFrames: 75,
    },
    {
      type: "text-slide",
      headline: "YOUR MVP",
      subtitle: "Built in 2 WEEKS",
      durationInFrames: 90,
    },
    {
      type: "text-slide",
      headline: "DESIGNED. ENGINEERED.",
      durationInFrames: 75,
    },
    {
      type: "cta",
      text: "LET'S BUILD",
      url: "ghostdigital.co.site",
      durationInFrames: 120,
    },
  ],
};
