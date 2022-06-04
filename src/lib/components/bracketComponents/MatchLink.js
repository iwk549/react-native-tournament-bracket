import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Rect, G } from "react-native-svg";

import CLinkSvg from "./CLinkSvg";
import {
  getTextX,
  getTeamNameYPlacement,
  offsets,
} from "../../utils/bracketUtils";
import { defaultTextColor } from "../../utils/defaultStyles";

function MatchLink({
  match,
  textAnchor,
  width,
  height,
  onSelectMatch,
  dateTimeFormatter,
  displayMatchNumber,
  textColor,
  highlightColor,
  fontSize,
}) {
  const X = getTextX(textAnchor, width);

  const matchNumber = displayMatchNumber
    ? "#" + (match.metadata?.matchNumber || match.matchNumber) + ":"
    : "";

  const highlight = match.highlight?.includes("match");
  const Y = getTeamNameYPlacement(0, height);

  const getLineText = () => {
    if (match.dummyMatch) return "";
    return `${
      displayMatchNumber
        ? "#" + (match.metadata?.matchNumber || match.matchNumber) + ": "
        : ""
    }${dateTimeFormatter ? dateTimeFormatter(match.dateTime) : ""}`;
  };

  return (
    <G onPressOut={onSelectMatch ? () => onSelectMatch(match) : () => {}}>
      {highlight && (
        <Rect
          width={width - offsets.text - offsets.lines}
          height={height / 4 + (height * 0.02 - 9.5)}
          rx={5}
          style={{
            fill:
              highlightColor?.backgroundColor ||
              defaultHighlight.backgroundColor,
          }}
          transform={`translate(${offsets.lines}, ${
            Y + offsets.lines + offsets.pixels
          })`}
        />
      )}
      <CLinkSvg
        x={X}
        y={height / 2 + offsets.lines}
        style={{
          textAnchor,
          fontSize: height / 7,
          fill: highlight
            ? highlightColor?.color || defaultHighlight.color
            : textColor || defaultTextColor,
        }}
        testID="match-link-text"
        fontSize={fontSize}
      >
        {getLineText()}
      </CLinkSvg>
    </G>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default MatchLink;
