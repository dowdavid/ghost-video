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
          zoom={scene.zoom}
          zoomOrigin={scene.zoomOrigin}
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
