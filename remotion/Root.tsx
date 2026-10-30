import React from "react";
import { Composition } from "remotion";
import type { AnyZodObject } from "remotion";
import { Episode, buildTimeline, getSlides } from "./Episode";
import { FPS, HEIGHT, WIDTH } from "./types";
import type { EpisodeProps } from "./types";
import { ComponentsSmoke } from "./components/ComponentsSmoke";
import { BoardSmoke } from "./board/elements/BoardSmoke";
import { SceneEngine } from "./scenes/SceneEngine";
import { ScenePGEngine } from "./scenes/ScenePGEngine";
import { SceneCloudKitchenEngine } from "./scenes/SceneCloudKitchenEngine";
import { SceneCloudKitchenShort } from "./scenes/SceneCloudKitchenShort";
import { SceneFounderHouseEngine } from "./scenes/SceneFounderHouseEngine";
import { SceneFounderHouseShort } from "./scenes/SceneFounderHouseShort";
import { SceneBangaloreCafeV2Engine } from "./scenes/SceneBangaloreCafeV2Engine";
import { SceneCultfitFranchiseEngine } from "./scenes/SceneCultfitFranchiseEngine";

const defaultProps: EpisodeProps & Record<string, unknown> = { theme: "ledger", captions: true, muted: false };

export const Root: React.FC = () => {
  return (
    <>
      {/* EPISODE 07 MASTER: The Economics of Owning a Cult.fit Franchise (Paisa Decode & Mr. Economics Benchmark) */}
      <Composition
        id="CultfitFranchiseMaster"
        component={SceneCultfitFranchiseEngine}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={7465}
        defaultProps={{ muted: false, captions: true }}
      />
      {/* FLAGSHIP V2: The Economics of Owning a Bangalore Specialty Café (Mr. Economics Benchmark) */}
      <Composition
        id="BangaloreCafeV2Master"
        component={SceneBangaloreCafeV2Engine}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={6684}
        defaultProps={{ muted: false, captions: true }}
      />
      {/* EPISODE 04 SHORT: 9:16 Viral Vertical Cutdown (The ₹35,000 Bed Trap) */}
      <Composition
        id="FounderHouseShort"
        component={SceneFounderHouseShort}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={700}
        defaultProps={{ muted: false }}
      />
      {/* EPISODE 04: The Economics of Bangalore Founder Houses (Paisa Decode Style) */}
      <Composition
        id="FounderHouseEpisodeV1"
        component={SceneFounderHouseEngine}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={8433}
        defaultProps={{ muted: false, captions: true }}
      />
      {/* EPISODE 03 SHORT: 9:16 Viral Vertical Cutdown (The ₹350 Biryani Squeeze) */}
      <Composition
        id="CloudKitchenShort"
        component={SceneCloudKitchenShort}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={860}
        defaultProps={{ muted: false }}
      />
      {/* EPISODE 03: The Brutal Economics of Bangalore Cloud Kitchens (Paisa Decode Style) */}
      <Composition
        id="CloudKitchenEpisodeV1"
        component={SceneCloudKitchenEngine}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={9741}
        defaultProps={{ muted: false, captions: true }}
      />
      {/* EPISODE 02: The Economics of Bangalore PG Hostels (Paisa Decode Style) */}
      <Composition
        id="PGEpisodeV1"
        component={ScenePGEngine}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={7929}
        defaultProps={{ muted: false, captions: true }}
      />
      {/* V3: Paisa Decode Caliber 2.5D Animated Motion Explainer */}
      <Composition
        id="CafeEpisodeV3"
        component={SceneEngine}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={8790}
        defaultProps={{ muted: false }}
      />
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

