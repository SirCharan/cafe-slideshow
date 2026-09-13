import React from "react";
import { Composition } from "remotion";
import type { AnyZodObject } from "remotion";
import { Episode, buildTimeline, getSlides } from "./Episode";
import { FPS, HEIGHT, WIDTH } from "./types";
import type { EpisodeProps } from "./types";
import { ComponentsSmoke } from "./components/ComponentsSmoke";
import { BoardSmoke } from "./board/elements/BoardSmoke";

const defaultProps: EpisodeProps & Record<string, unknown> = { theme: "ledger", captions: true, muted: false };

export const Root: React.FC = () => {
  return (
    <>
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
      {/* Temporary smoke test for remotion/components/*; remove once BoardSmoke exists. */}
      <Composition id="ComponentsSmoke" component={ComponentsSmoke} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={91} />
      {/* Smoke test for every board element kind — reads out/smoke-board.json when present. */}
      <Composition id="BoardSmoke" component={BoardSmoke} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={150} />
    </>
  );
};
