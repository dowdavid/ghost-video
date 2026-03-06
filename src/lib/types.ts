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
