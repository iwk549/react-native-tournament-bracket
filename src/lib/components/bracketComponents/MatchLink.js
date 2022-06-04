import React from "react";
import { Rect, G } from "react-native-svg";

import CLinkSvg from "./CLinkSvg";
import {
  getTextX,
  getTeamNameYPlacement,
  offsets,
  linkHeight,
} from "../../utils/bracketUtils";
import {
  defaultTextColor,
  defaultBackgroundColor,
  defaultHighlight,
} from "../../utils/defaultStyles";

function MatchLink({
  match,
  textAnchor,
  width,
  height,
  dateTimeFormatter,
  displayMatchNumber,
  textColor,
  highlightColor,
  backgroundColor,
  fontSize,
  isTapped,
}) {
  const X = getTextX(textAnchor, width);
  const highlight = match.highlight?.includes("match");
  const Y = getTeamNameYPlacement(0, height);

  const getLineText = () => {
    if (match.dummyMatch) return "";
    return `${
      displayMatchNumber
        ? "#" + (match.metadata?.matchNumber || match.matchNumber)
        : ""
    }${dateTimeFormatter ? ": " + dateTimeFormatter(match.dateTime) : ""}`;
  };

  return (
    <G>
      <Rect
        width={width - offsets.text - offsets.lines}
        height={linkHeight(height)}
        rx={5}
        style={{
          fill: highlight
            ? highlightColor?.backgroundColor ||
              defaultHighlight.backgroundColor
            : backgroundColor || defaultBackgroundColor,
        }}
        transform={`translate(${offsets.lines}, ${
          Y + offsets.lines + offsets.pixels
        })`}
        stroke={
          isTapped ? highlightColor || defaultHighlight.backgroundColor : "none"
        }
        fillOpacity={isTapped ? 0.5 : 1}
      />
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
        textAnchor={textAnchor}
        testID="match-link-text"
        fontSize={fontSize}
      >
        {getLineText()}
      </CLinkSvg>
    </G>
  );
}

export default MatchLink;
