import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Rect, G, Line } from "react-native-svg";

import {
  getTeamNameYPlacement,
  getTextX,
  offsets,
  getLineX,
} from "../../utils/bracketUtils";
import { defaultTextColor, defaultPopColor } from "../../utils/defaultStyles";
import CLinkSvg from "./CLinkSvg";

function SingleTeam({
  match,
  team,
  textAnchor,
  verticalPosition,
  width,
  height,
  bracketEnd,
  isSemiFinal,
  isFinal,
  showFullTeamNames,
  onSelectTeam,
  textColor,
  popColor,
  backgroundColor,
  lineColor,
  highlightColor,
  roundCount,
  index,
  hidePKs,
  fontSize,
}) {
  const [showTooltip, setShowTooltip] = useState({ show: false, label: "" });
  const Y = getTeamNameYPlacement(verticalPosition, height);
  const X = getTextX(textAnchor, width);
  const y1 = height / 3 + offsets.lines;
  const y2 = (height * 3) / 5;

  const noConnector =
    roundCount > 2 &&
    ((index % 2 === 0 && verticalPosition % 2 === 0) ||
      (index % 2 === 1 && verticalPosition % 2 === 1)) &&
    bracketEnd !== "top";

  const lineStyle = {
    stroke: match.dummyMatch
      ? backgroundColor || defaultBackgroundColor
      : isFinal
      ? popColor || defaultPopColor
      : lineColor || defaultTextColor,
  };

  const toggleFullTeamName = () => {
    let tooltip = { ...showTooltip };
    tooltip.show = !tooltip.show;
    tooltip.label = match[team + "TeamName"];
    setShowTooltip(tooltip);
  };

  const renderUnderline = () => {
    const lineY = verticalPosition === 0 ? Y + offsets.lines : Y - height / 5;

    return (
      <Line
        x1={offsets.lines}
        x2={match.dummyMatch ? offsets.lines : width - offsets.lines}
        y1={lineY}
        y2={lineY}
        style={lineStyle}
      />
    );
  };

  const renderJoinLine = () => {
    const X = getLineX(textAnchor, width);
    const hideTeamLine =
      match.dummyMatch ||
      noConnector ||
      (bracketEnd === "top" && verticalPosition === 0) ||
      (bracketEnd === "bottom" && verticalPosition === 1);
    if (hideTeamLine) return null;
    return textAnchor === "middle" ? (
      <G>
        <Line
          x1={offsets.lines}
          x2={offsets.lines}
          y1={y1}
          y2={y2}
          style={lineStyle}
        />
        <Line
          x1={width - offsets.lines}
          x2={width - offsets.lines}
          y1={y1}
          y2={y2}
          style={lineStyle}
        />
      </G>
    ) : (
      <G>
        {/* this is for the line connecting the two team horizontal lines */}
        <Line x1={width - X} x2={width - X} y1={y1} y2={y2} style={lineStyle} />
        {/* this is for the line next to the team name */}
        {!isSemiFinal && !isFinal && (
          <Line
            x1={width - X}
            x2={width - X}
            y1={verticalPosition === 0 ? 0 : y2}
            y2={verticalPosition === 0 ? y1 : height}
            style={lineStyle}
          />
        )}
      </G>
    );
  };

  const otherTeam = team === "home" ? "away" : "home";
  const isWinner = match.matchAccepted
    ? match[team + "TeamScore"] > match[otherTeam + "TeamScore"] ||
      (match[team + "TeamScore"] === match[otherTeam + "TeamScore"] &&
        match[team + "TeamPKs"] > match[otherTeam + "TeamPKs"])
    : false;

  const getLineText = () => {
    if (match.dummyMatch) return "";
    const teamName = match[team + "TeamName"];
    if (!teamName)
      throw new Error(
        `The ${team}TeamName property is required on every match unless using the dummyMatch property.`
      );
    const teamAbbreviation =
      match[team + "TeamAbbreviation"] || teamName.slice(0, 6).toUpperCase();

    let teamText =
      (showTooltip.show && showTooltip.label === teamName) || showFullTeamNames
        ? teamName
        : teamAbbreviation;

    let goals = match.matchComplete
      ? `${match[team + "TeamScore"] || 0}${
          match[team + "TeamScore"] === match[otherTeam + "TeamScore"] &&
          !hidePKs
            ? ` (${match[team + "TeamPKs"] || 0})`
            : ""
        }`
      : "";

    if (textAnchor === "end")
      teamText = `${goals ? goals + " - " : ""}${teamText}`;
    else teamText = `${teamText}${goals ? " - " + goals : ""}`;
    return teamText;
  };

  const hasLogo = match[team + "TeamLogo"];
  const highlight = match.highlight?.includes(team);

  return (
    <G
      data-testid="single-team"
      onPress={onSelectTeam ? () => onSelectTeam(match, team) : () => {}}
    >
      {highlight && (
        <Rect
          width={width - offsets.text - offsets.lines}
          height={height / 5 - 4}
          rx={5}
          style={{
            fill:
              highlightColor?.backgroundColor ||
              defaultHighlight.backgroundColor,
          }}
          transform={`translate(${offsets.lines}, ${
            verticalPosition === 0
              ? y1 + offsets.pixels - height / 5
              : y2 + offsets.pixels
          })`}
          data-testid="team-highlight"
        />
      )}
      <CLinkSvg
        x={
          X +
          (hasLogo
            ? textAnchor === "start"
              ? height / 4
              : textAnchor === "end"
              ? -(height / 4)
              : 0
            : 0)
        }
        y={verticalPosition === 0 ? y1 - height / 20 : Y - height / 20}
        style={{
          textAnchor,
          fontSize: height / 6,
          fill: highlight
            ? highlightColor?.color || defaultHighlight.color
            : textColor || defaultTextColor,
        }}
        onMouseOver={() => {
          toggleFullTeamName();
        }}
        onMouseOut={() => {
          toggleFullTeamName();
        }}
        boldText={isWinner}
        clickHandler={onSelectTeam ? () => onSelectTeam(match, team) : null}
        testID="team-name-text"
        fontSize={fontSize}
      >
        {getLineText()}
      </CLinkSvg>
      {renderUnderline()}
      {renderJoinLine()}
      {/* {hasLogo ? (
        <Image
          href={match[team + "TeamLogo"]}
          x={
            textAnchor === "middle" || textAnchor === "start"
              ? offsets.text
              : width - height / 5 - offsets.text
          }
          y={verticalPosition === 0 ? y1 - height / 5 : y2}
          width={height / 5}
          height={height / 5}
        />
      ) : null}
      {hasLogo && textAnchor === "middle" && (
        <Image
          href={match[team + "TeamLogo"]}
          x={width - height / 5 - offsets.text}
          y={verticalPosition === 0 ? y1 - height / 5 : y2}
          width={height / 5}
          height={height / 5}
        />
      )} */}
    </G>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SingleTeam;
