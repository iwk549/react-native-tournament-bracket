import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { G, Rect, Line } from "react-native-svg";

import {
  defaultBackgroundColor,
  defaultTextColor,
} from "../../utils/defaultStyles";
import { getLineX } from "../../utils/bracketUtils";

function MatchConnector({
  position,
  width,
  bracketEnd,
  textAnchor,
  isSemiFinal,
  isFinal,
  isOnlyMatch,
  backgroundColor,
  lineColor,
  isDummy,
  roundCount,
  index,
}) {
  if (isFinal || isSemiFinal || isOnlyMatch) return null;

  const height = position.Y.blockEnd - position.Y.matchEnd;
  const yStart =
    bracketEnd === "top"
      ? position.Y.matchEnd
      : bracketEnd === "bottom"
      ? position.Y.blockStart
      : position.Y.matchEnd;
  const renderLines = (verticalPosition) => {
    if (
      (roundCount > 2 &&
        ((index % 2 === 0 &&
          verticalPosition === "bottom" &&
          bracketEnd !== "top") ||
          (index % 2 === 1 &&
            verticalPosition === "top" &&
            bracketEnd !== "bottom"))) ||
      isDummy
    )
      return null;

    const X = getLineX(textAnchor, width);
    return textAnchor !== "middle" ? (
      <G>
        <Line
          x1={width - X}
          x2={width - X}
          y1={0}
          y2={height}
          style={{
            stroke: isDummy
              ? backgroundColor || defaultBackgroundColor
              : lineColor || defaultTextColor,
          }}
        />
      </G>
    ) : null;
  };

  return (
    <>
      <G transform={`translate(${position.X}, ${yStart})`}>
        <Rect
          width={Math.abs(width)}
          height={Math.abs(height)}
          style={{ fill: backgroundColor || defaultBackgroundColor }}
        />
        {renderLines("top")}
      </G>
      {bracketEnd === "middle" && !isFinal && (
        <G transform={`translate(${position.X}, ${position.Y.blockStart})`}>
          <Rect
            width={Math.abs(width)}
            height={Math.abs(height)}
            style={{ fill: backgroundColor || defaultBackgroundColor }}
          />
          {renderLines("bottom")}
        </G>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default MatchConnector;
