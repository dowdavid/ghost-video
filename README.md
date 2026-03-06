# Ghost Video Template System

Config-driven video production for Ghost Digital. Marketing videos, build-in-public clips, app showcases.

## Quick Start

1. Drop assets (MOV, PNG, MP3) into `public/`
2. Create a config file in `src/videos/` (see below)
3. Import it in `src/Root.tsx` and add to the `videos` array
4. Run `npm run dev` to preview at localhost:3000
5. Render from the Remotion studio UI or CLI

## Creating a Video

Each video is a config object in `src/videos/`. Copy `ghost-digital.ts` as a starting point.

```ts
import type { VideoConfig } from "../lib/types";

export const myVideo: VideoConfig = {
  id: "MyVideo",           // appears in Remotion studio sidebar
  width: 1920,
  height: 1080,
  fps: 30,
  music: {                  // optional
    src: "track.mp3",       // filename in public/
    startFrom: 200,         // frame offset into the track (at 30fps)
    volume: 0.6,
  },
  scenes: [
    // add scenes here (see Scene Types below)
  ],
};
```

### Registering the video

In `src/Root.tsx`, import and add to the array:

```ts
import { myVideo } from "./videos/my-video";

const videos = [ghostDigital, myVideo];
```

## Scene Types

### logo-reveal

Ghost Digital logo animation. Opens or closes a video.

```ts
{
  type: "logo-reveal",
  variant: "wordmark",      // "wordmark" = full logo + text, "mark" = icon only
  durationInFrames: 75,
}
```

### text-slide

Headline with optional subtitle. Good for hooks, key messages, stats.

```ts
{
  type: "text-slide",
  headline: "YOUR MVP",
  subtitle: "Built in 2 WEEKS",  // optional
  durationInFrames: 90,
}
```

### media-showcase

Screen recording or screenshot. Three display modes.

```ts
{
  type: "media-showcase",
  src: "app-demo.mov",       // filename in public/
  media: "video",            // "video" or "image"
  display: "floating",       // "floating" | "full" | "device"
  caption: "Dashboard v1",   // optional, appears below
  startFrom: 30,             // optional, skip into video (frames)
  durationInFrames: 120,
}
```

Display modes:
- `floating` (default) — 75% width, rounded corners, shadow. Clean.
- `full` — edge to edge, fills frame. Caption overlays bottom with gradient.
- `device` — inside a minimal browser chrome frame.

### cta

Closing frame. Ghost logo mark with text and optional URL.

```ts
{
  type: "cta",
  text: "LET'S BUILD",
  url: "ghostdigital.co.site",  // optional
  durationInFrames: 120,
}
```

## Timing Guide

At 30fps:
- 30 frames = 1 second
- 60 frames = 2 seconds
- 90 frames = 3 seconds
- 120 frames = 4 seconds

Each scene handles its own enter/exit animations (fade in first 15-25 frames, fade out last 20 frames). Keep scenes at 60+ frames minimum so animations have room.

## Music Sync

Music is manual per video. To sync a drop or beat:

1. Find the timestamp of the drop in the original track (e.g. 19 seconds)
2. Calculate when you want it to hit in the video (e.g. CTA at 8 seconds in)
3. Set `startFrom` to: (drop_time - hit_time) * fps = (19 - 8) * 30 = 330

Audio auto-fades in over the first 10 frames and out over the last 60 frames.

## Assets

Put all media files in `public/`:
- Screen recordings: QuickTime MOV or MP4
- Screenshots: PNG or JPG
- Music: MP3
- Logos: already there (logo-light.svg, wordmark-light.svg)

## Rendering

From the Remotion studio UI, click render. Or via CLI:

```bash
npx remotion render GhostDigital out/ghost-digital.mp4
```

## File Structure

```
src/
  Root.tsx              — registers all video configs as Compositions
  lib/
    types.ts            — VideoConfig, Scene types
    constants.ts        — brand colors (#101010, #FFFFFF), fonts (Bebas Neue, Inter), logos
  scenes/
    index.tsx           — createVideoComposition (maps config to component)
    LogoReveal.tsx      — wordmark or mark variant
    TextSlide.tsx       — headline + optional subtitle
    MediaShowcase.tsx   — video/image with display modes
    CTA.tsx             — logo + text + url
  components/
    DeviceFrame.tsx     — browser chrome wrapper
  videos/
    ghost-digital.ts    — Ghost Digital marketing video
public/
  logo-light.svg        — ghost icon (white)
  wordmark-light.svg    — ghost icon + GHOST DIGITAL text (white)
  *.mp3 / *.mov / *.png — media assets
```
