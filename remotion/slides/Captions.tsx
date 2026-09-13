import React from "react";
import type { Theme } from "../types";

export const Captions: React.FC<{ theme: Theme; text: string }> = ({ theme, text }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: 90,
      padding: "30px 64px",
      backgroundColor: theme.paper2,
      borderTop: `1px solid ${theme.line}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span
      style={{
        fontFamily: theme.fontBody,
        fontSize: 34,
        fontWeight: 500,
        color: theme.ink,
        textAlign: "center",
        maxWidth: 1500,
      }}
    >
      {text}
    </span>
  </div>
);
