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
