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
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
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
          transform:
            display === "full" ? undefined : `scale(${0.9 + scaleIn * 0.1})`,
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
