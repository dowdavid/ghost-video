import "./index.css";
import { Composition } from "remotion";
import { createVideoComposition } from "./scenes";
import { ghostDigital } from "./videos/ghost-digital";
import { spawnDemo } from "./videos/spawn-demo";

const videos = [ghostDigital, spawnDemo];

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
