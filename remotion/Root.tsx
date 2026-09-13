import React from "react";
import { Composition } from "remotion";
import type { AnyZodObject } from "remotion";
import { Episode, buildTimeline, getSlides } from "./Episode";
import { FPS, HEIGHT, WIDTH } from "./types";
import type { EpisodeProps } from "./types";

const defaultProps: EpisodeProps & Record<string, unknown> = { theme: "ledger", captions: true, muted: false };

export const Root: React.FC = () => {
  return (
    <Composition<AnyZodObject, EpisodeProps & Record<string, unknown>>
      id="CafeEpisode"
      component={Episode}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={300}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: buildTimeline(getSlides()).totalFrames,
        props,
      })}
    />
  );
};
