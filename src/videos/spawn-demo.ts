import type { VideoConfig } from "../lib/types";

export const spawnDemo: VideoConfig = {
  id: "SpawnDemo",
  width: 1920,
  height: 1080,
  fps: 30,
  music: {
    src: "sigmamusicart-no-copyright-music-446509.mp3",
    startFrom: 0,
    volume: 0.4,
  },
  scenes: [
    // Hook
    {
      type: "text-slide",
      headline: "WHAT IF YOUR IDE\nWAS A CANVAS?",
      durationInFrames: 90,
    },

    // Open project
    {
      type: "text-slide",
      headline: "OPEN A PROJECT.\nBROWSE YOUR FILES.",
      durationInFrames: 65,
    },
    {
      type: "media-showcase",
      src: "spawn vids/open project.mov",
      media: "video",
      display: "floating",
      startFrom: 120,
      zoom: 1.6,
      zoomOrigin: "center center",
      durationInFrames: 130,
    },

    // File editor
    {
      type: "text-slide",
      headline: "EDIT CODE.\nSYNTAX HIGHLIGHTED.",
      durationInFrames: 65,
    },
    {
      type: "media-showcase",
      src: "spawn vids/file editor.mov",
      media: "video",
      display: "floating",
      startFrom: 180,
      zoom: 1.6,
      zoomOrigin: "center center",
      durationInFrames: 160,
    },

    // Live preview
    {
      type: "text-slide",
      headline: "LAUNCH A\nLIVE PREVIEW.",
      durationInFrames: 65,
    },
    {
      type: "media-showcase",
      src: "spawn vids/launch browser.mov",
      media: "video",
      display: "floating",
      startFrom: 420,
      zoom: 1.6,
      zoomOrigin: "82% center",
      durationInFrames: 160,
    },

    // Multiple terminals
    {
      type: "text-slide",
      headline: "SPAWN AS MANY\nTERMINALS AS YOU NEED.",
      durationInFrames: 65,
    },
    {
      type: "media-showcase",
      src: "spawn vids/add more terminals.mov",
      media: "video",
      display: "floating",
      startFrom: 360,
      zoom: 1.4,
      zoomOrigin: "center 35%",
      durationInFrames: 160,
    },

    // Product name
    {
      type: "text-slide",
      headline: "SPAWN",
      durationInFrames: 75,
    },

    // CTA
    {
      type: "cta",
      text: "LET'S BUILD",
      url: "ghostdigital.co.site",
      durationInFrames: 90,
    },
  ],
};
