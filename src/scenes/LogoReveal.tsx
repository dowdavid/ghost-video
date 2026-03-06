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
