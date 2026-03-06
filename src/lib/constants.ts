import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { staticFile } from "remotion";

export const { fontFamily: bebasNeue } = loadBebasNeue();
export const { fontFamily: inter } = loadInter();

export const BG = "#101010";
export const FG = "#FFFFFF";

export const logo = staticFile("logo-light.svg");
export const wordmark = staticFile("wordmark-light.svg");
