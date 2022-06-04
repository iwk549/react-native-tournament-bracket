import React from "react";
import { Rect, G } from "react-native-svg";

import SingleTeam from "./SingleTeam";
import MatchLink from "./MatchLink";
import { defaultBackgroundColor } from "../../utils/defaultStyles";
import { teamOrder } from "../../utils/bracketUtils";

function SingleMatch({
  match,
  textAnchor,
  width,
  placement,
  bracketEnd,
  isSemiFinal,
  isFinal,
  matchHeight,
  spectate,
  onSelectMatch,
  showFullTeamNames,
  onSelectTeam,
  flipTeams,
  backgroundColor,
  textColor,
  popColor,
  lineColor,
  highlightColor,
  dateTimeFormatter,
  displayMatchNumber,
  roundCount,
  index,
  hidePKs,
  fontSize,
  tappedMatch,
  matchKey,
}) {
  const transform = `translate(${placement.X}, ${placement.Y})`;

  return (
    <G transform={transform} data-testid="single-match">
      <Rect
        width={Math.abs(width)}
        height={Math.abs(matchHeight)}
        style={{
          fill: backgroundColor || defaultBackgroundColor,
        }}
      />
      {teamOrder(flipTeams).map((t, i) => {
        return (
          <React.Fragment key={t}>
            <SingleTeam
              match={match}
              team={t}
              verticalPosition={i}
              textAnchor={textAnchor}
              width={width}
              height={matchHeight}
              bracketEnd={bracketEnd}
              isSemiFinal={isSemiFinal}
              isFinal={isFinal}
              spectate={spectate}
              showFullTeamNames={showFullTeamNames}
              onSelectTeam={onSelectTeam}
              textColor={textColor}
              popColor={popColor}
              backgroundColor={backgroundColor}
              lineColor={lineColor}
              roundCount={roundCount}
              index={index}
              hidePKs={hidePKs}
              highlightColor={highlightColor}
              fontSize={fontSize}
              placement={placement}
              isTapped={
                tappedMatch?.key === matchKey && tappedMatch?.selected === i
              }
            />
            {i === 0 && (
              <MatchLink
                match={match}
                textAnchor={textAnchor}
                width={width}
                height={matchHeight}
                onSelectMatch={onSelectMatch}
                dateTimeFormatter={dateTimeFormatter}
                displayMatchNumber={displayMatchNumber}
                textColor={textColor}
                highlightColor={highlightColor}
                backgroundColor={backgroundColor}
                fontSize={fontSize}
                isTapped={
                  tappedMatch?.key === matchKey && tappedMatch?.selected === -1
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </G>
  );
}

export default SingleMatch;
