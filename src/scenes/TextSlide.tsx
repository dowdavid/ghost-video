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
