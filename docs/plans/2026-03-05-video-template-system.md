# Video Template System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the Ghost Digital marketing video into a config-driven template system where new videos are defined as plain objects and rendered from reusable scene components.

**Architecture:** Scene components (LogoReveal, TextSlide, MediaShowcase, CTA) accept props from a video config. A renderer maps scene configs to components wrapped in Sequences. Root.tsx auto-registers all video configs as Compositions.

**Tech Stack:** Remotion 4.0.432, React 19, TypeScript, @remotion/google-fonts, Tailwind CSS 4

**Project root:** `/Users/daviddow/MVP's/pre-mvps/ghost video/`

---

### Task 1: Create types and constants

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`

**Step 1: Create the types file**

```ts
// src/lib/types.ts
import { StaticFile } from "remotion";

export type LogoRevealScene = {
  type: "logo-reveal";
  variant: "wordmark" | "mark";
  durationInFrames: number;
};

export type TextSlideScene = {
  type: "text-slide";
  headline: string;
  subtitle?: string;
  durationInFrames: number;
};

export type MediaShowcaseScene = {
  type: "media-showcase";
  src: string;
  media: "video" | "image";
  display: "full" | "floating" | "device";
  caption?: string;
  startFrom?: number;
  durationInFrames: number;
};

export type CTAScene = {
  type: "cta";
  text: string;
  url?: string;
  durationInFrames: number;
};

export type Scene = LogoRevealScene | TextSlideScene | MediaShowcaseScene | CTAScene;

export type MusicConfig = {
  src: string;
  startFrom: number;
  volume: number;
};

export type VideoConfig = {
  id: string;
  width: number;
  height: number;
  fps: number;
  music?: MusicConfig;
  scenes: Scene[];
};
```

**Step 2: Create the constants file**

```ts
// src/lib/constants.ts
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { staticFile } from "remotion";

export const { fontFamily: bebasNeue } = loadBebasNeue();
export const { fontFamily: inter } = loadInter();

export const BG = "#101010";
export const FG = "#FFFFFF";

export const logo = staticFile("logo-light.svg");
export const wordmark = staticFile("wordmark-light.svg");
```

**Step 3: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors (types file is standalone, constants imports are valid)

**Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/constants.ts
git commit -m "feat: add video config types and brand constants"
```

---

### Task 2: Extract LogoReveal scene component

**Files:**
- Create: `src/scenes/LogoReveal.tsx`

**Step 1: Create the LogoReveal component**

Extract from GhostDigitalVideo.tsx. Accept `variant` prop to switch between wordmark and mark.

```tsx
// src/scenes/LogoReveal.tsx
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BG, logo, wordmark } from "../lib/constants";
import type { LogoRevealScene } from "../lib/types";

type Props = Omit<LogoRevealScene, "type" | "durationInFrames"> & {
  durationInFrames: number;
};

export const LogoReveal: React.FC<Props> = ({ variant, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 30, stiffness: 120, mass: 0.8 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const src = variant === "wordmark" ? wordmark : logo;
  const imgStyle =
    variant === "wordmark"
      ? { height: 80 as const }
      : { width: 200 as const, height: 200 as const };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <Img
        src={src}
        style={{
          ...imgStyle,
          opacity,
          transform: `scale(${0.85 + scale * 0.15})`,
        }}
      />
    </AbsoluteFill>
  );
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/scenes/LogoReveal.tsx
git commit -m "feat: extract LogoReveal scene component"
```

---

### Task 3: Extract TextSlide scene component

**Files:**
- Create: `src/scenes/TextSlide.tsx`

**Step 1: Create the TextSlide component**

Generic text scene. Headline springs in, optional subtitle slides up below.

```tsx
// src/scenes/TextSlide.tsx
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BG, FG, bebasNeue, inter } from "../lib/constants";
import type { TextSlideScene } from "../lib/types";

type Props = Omit<TextSlideScene, "type">;

export const TextSlide: React.FC<Props> = ({
  headline,
  subtitle,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.6 },
  });

  const subtitleOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [25, 45], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: bebasNeue,
            fontSize: 160,
            color: FG,
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
          }}
        >
          {headline}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: inter,
              fontSize: 36,
              color: FG,
              letterSpacing: "-0.02em",
              marginTop: 30,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/scenes/TextSlide.tsx
git commit -m "feat: extract TextSlide scene component"
```

---

### Task 4: Create MediaShowcase scene component with DeviceFrame

**Files:**
- Create: `src/components/DeviceFrame.tsx`
- Create: `src/scenes/MediaShowcase.tsx`

**Step 1: Create the DeviceFrame component**

Minimal browser chrome built with divs. Monochrome.

```tsx
// src/components/DeviceFrame.tsx
import { BG, FG } from "../lib/constants";

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={dotStyle} />
        <div style={dotStyle} />
        <div style={dotStyle} />
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            height: 24,
            borderRadius: 6,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
};
```

**Step 2: Create the MediaShowcase component**

Handles video and image media with three display modes.

```tsx
// src/scenes/MediaShowcase.tsx
import {
  AbsoluteFill,
  Img,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { BG, FG, inter } from "../lib/constants";
import { DeviceFrame } from "../components/DeviceFrame";
import type { MediaShowcaseScene } from "../lib/types";

type Props = Omit<MediaShowcaseScene, "type">;

export const MediaShowcase: React.FC<Props> = ({
  src,
  media,
  display,
  caption,
  startFrom: mediaStartFrom,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 120, mass: 0.8 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const captionOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mediaSrc = staticFile(src);

  const MediaElement =
    media === "video" ? (
      <Video
        src={mediaSrc}
        startFrom={mediaStartFrom ?? 0}
        style={{
          width: "100%",
          display: "block",
        }}
      />
    ) : (
      <Img
        src={mediaSrc}
        style={{
          width: "100%",
          display: "block",
        }}
      />
    );

  const renderMedia = () => {
    if (display === "full") {
      return (
        <AbsoluteFill>
          {MediaElement}
          {caption && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "60px 40px 40px",
                background:
                  "linear-gradient(transparent, rgba(0,0,0,0.8))",
                fontFamily: inter,
                fontSize: 28,
                color: FG,
                letterSpacing: "-0.01em",
                opacity: captionOpacity,
              }}
            >
              {caption}
            </div>
          )}
        </AbsoluteFill>
      );
    }

    const mediaContent =
      display === "device" ? (
        <DeviceFrame>{MediaElement}</DeviceFrame>
      ) : (
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          {MediaElement}
        </div>
      );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "75%",
        }}
      >
        {mediaContent}
        {caption && (
          <div
            style={{
              fontFamily: inter,
              fontSize: 24,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "-0.01em",
              marginTop: 24,
              opacity: captionOpacity,
            }}
          >
            {caption}
          </div>
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: display === "full" ? "transparent" : BG,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          transform: display === "full" ? undefined : `scale(${0.9 + scaleIn * 0.1})`,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {renderMedia()}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/DeviceFrame.tsx src/scenes/MediaShowcase.tsx
git commit -m "feat: add MediaShowcase scene with device frame component"
```

---

### Task 5: Extract CTA scene component

**Files:**
- Create: `src/scenes/CTA.tsx`

**Step 1: Create the CTA component**

```tsx
// src/scenes/CTA.tsx
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BG, FG, bebasNeue, inter, logo } from "../lib/constants";
import type { CTAScene } from "../lib/types";

type Props = Omit<CTAScene, "type" | "durationInFrames">;

export const CTA: React.FC<Props> = ({ text, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });

  const textOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [20, 40], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const urlOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Img
          src={logo}
          style={{
            width: 160,
            height: 160,
            transform: `scale(${logoScale})`,
          }}
        />
        <div
          style={{
            fontFamily: bebasNeue,
            fontSize: 72,
            color: FG,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginTop: 32,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          {text}
        </div>
        {url && (
          <div
            style={{
              fontFamily: inter,
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "-0.01em",
              marginTop: 20,
              opacity: urlOpacity,
            }}
          >
            {url}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/scenes/CTA.tsx
git commit -m "feat: extract CTA scene component"
```

---

### Task 6: Create scene renderer and video composer

**Files:**
- Create: `src/scenes/index.tsx`

**Step 1: Create the scene renderer**

Maps a VideoConfig to a composed Remotion component with sequenced scenes and audio.

```tsx
// src/scenes/index.tsx
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
} from "remotion";
import { BG } from "../lib/constants";
import type { VideoConfig, Scene } from "../lib/types";
import { LogoReveal } from "./LogoReveal";
import { TextSlide } from "./TextSlide";
import { MediaShowcase } from "./MediaShowcase";
import { CTA } from "./CTA";

const renderScene = (scene: Scene) => {
  switch (scene.type) {
    case "logo-reveal":
      return (
        <LogoReveal
          variant={scene.variant}
          durationInFrames={scene.durationInFrames}
        />
      );
    case "text-slide":
      return (
        <TextSlide
          headline={scene.headline}
          subtitle={scene.subtitle}
          durationInFrames={scene.durationInFrames}
        />
      );
    case "media-showcase":
      return (
        <MediaShowcase
          src={scene.src}
          media={scene.media}
          display={scene.display}
          caption={scene.caption}
          startFrom={scene.startFrom}
          durationInFrames={scene.durationInFrames}
        />
      );
    case "cta":
      return <CTA text={scene.text} url={scene.url} />;
  }
};

export const createVideoComposition = (config: VideoConfig) => {
  const totalFrames = config.scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );

  const VideoComposition: React.FC = () => {
    let currentFrame = 0;

    return (
      <AbsoluteFill style={{ backgroundColor: BG }}>
        {config.music && (
          <Audio
            src={staticFile(config.music.src)}
            startFrom={config.music.startFrom}
            volume={(f) =>
              interpolate(
                f,
                [0, 10, totalFrames - 60, totalFrames],
                [0, config.music!.volume, config.music!.volume, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              )
            }
          />
        )}
        {config.scenes.map((scene, i) => {
          const from = currentFrame;
          currentFrame += scene.durationInFrames;
          return (
            <Sequence
              key={i}
              from={from}
              durationInFrames={scene.durationInFrames}
            >
              {renderScene(scene)}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  };

  return { component: VideoComposition, totalFrames };
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/scenes/index.tsx
git commit -m "feat: add scene renderer and video composer"
```

---

### Task 7: Create Ghost Digital video config and wire up Root.tsx

**Files:**
- Create: `src/videos/ghost-digital.ts`
- Modify: `src/Root.tsx`

**Step 1: Create the Ghost Digital video config**

Reproduce the existing marketing video exactly as a config object.

```ts
// src/videos/ghost-digital.ts
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
```

**Note:** The "DESIGNED." / "ENGINEERED." scene with the slide-from-left/right animation is a specific variant of TextSlide. The generic TextSlide uses a spring-in for the headline. This is an acceptable simplification for the template system. If you later want the split-slide animation back, create a dedicated scene type.

**Step 2: Rewrite Root.tsx**

```tsx
// src/Root.tsx
import "./index.css";
import { Composition } from "remotion";
import { createVideoComposition } from "./scenes";
import { ghostDigital } from "./videos/ghost-digital";

const videos = [ghostDigital];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {videos.map((config) => {
        const { component, totalFrames } = createVideoComposition(config);
        return (
          <Composition
            key={config.id}
            id={config.id}
            component={component}
            durationInFrames={totalFrames}
            fps={config.fps}
            width={config.width}
            height={config.height}
          />
        );
      })}
    </>
  );
};
```

**Step 3: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 4: Verify in Remotion studio**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npm run dev`
Expected: Studio opens, GhostDigital composition appears in sidebar, plays correctly with all 4 scenes and music.

**Step 5: Commit**

```bash
git add src/videos/ghost-digital.ts src/Root.tsx
git commit -m "feat: wire up config-driven Root with Ghost Digital video"
```

---

### Task 8: Cleanup

**Files:**
- Delete: `src/GhostDigitalVideo.tsx`
- Delete: `src/Composition.tsx`
- Delete: `generate-audio.js`
- Delete: `public/drone.wav`

**Step 1: Remove old files**

```bash
rm src/GhostDigitalVideo.tsx src/Composition.tsx generate-audio.js public/drone.wav
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npx tsc --noEmit`
Expected: No errors

**Step 3: Verify studio still works**

Run: `cd "/Users/daviddow/MVP's/pre-mvps/ghost video" && npm run dev`
Expected: Studio opens, video plays identically to before.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old single-file composition and generated audio"
```
