import React, { createRef, useEffect, useRef, useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import Svg, { G } from "react-native-svg";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import {
  separateAndSplit,
  linkHeight,
  teamOrder,
  defaultMatchHeight,
  checkZoomLevel,
} from "../utils/bracketUtils";
import {
  defaultBackgroundColor,
  defaultPopColor,
} from "../utils/defaultStyles";
import SingleMatch from "./bracketComponents/SingleMatch";
import MatchConnector from "./bracketComponents/MatchConnector";

function TournamentBracket({
  matches,
  onSelectMatch,
  onSelectMatchLongPress,
  onSelectTeam,
  onSelectTeamLongPress,
  backgroundColor,
  highlightColor,
  popColor,
  textColor,
  width,
  height,
  matchHeight,
  orientation = "portrait",
  selectedBracket = "main",
  disableStrictBracketSizing,
  showFullTeamNames,
  flipTeams,
  dateTimeFormatter,
  lineColor,
  displayMatchNumber = true,
  hidePKs,
  matchKeyCreator = (m) => `${m.round}${m.matchNumber}`,
  manualZoom,
  setManualZoom,
  allowPinch = true,
}) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [bracket, setBracket] = useState([]);
  const [matchPositions, setMatchPositions] = useState([]);
  const [tappedMatch, setTappedMatch] = useState(null);
  const [bracketSize, setBracketSize] = useState({
    width: screenWidth - 10,
    height: screenHeight - 10,
    matchHeight: defaultMatchHeight,
    fontSize: defaultMatchHeight * 0.16,
  });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const newMatchHeight = matchHeight || defaultMatchHeight;
    const newBracketSize = {
      width: (width || screenWidth - 4) * zoom,
      height: (height || screenHeight - 4) * zoom,
      matchHeight: newMatchHeight * zoom,
      fontSize: newMatchHeight * 0.16 * zoom,
    };
    setBracketSize(newBracketSize);
  }, [orientation, width, height, matchHeight, zoom]);

  useEffect(() => {
    if (checkZoomLevel(manualZoom)) setZoom(manualZoom);
  }, [manualZoom]);

  useEffect(() => {
    let newBracket = separateAndSplit(
      allRounds,
      selectedBracket,
      matches,
      orientation === "landscape",
      disableStrictBracketSizing
    );
    setBracket(newBracket);

    // set x, y coordinate boundaries for each match
    let newMatchPositions = [];
    let lbx = 0;
    for (let i = 0; i < newBracket.length; i++) {
      let lby = 0;
      const ubx = lbx + bracketSize.width / newBracket.length;
      for (let ii = 0; ii < newBracket[i].length; ii++) {
        let newPosition = { lbx, lby, ubx };
        const areaHeight = bracketSize.height / newBracket[i].length;
        const uby = lby + areaHeight;
        newPosition.uby = uby;
        newMatchPositions.push([newPosition, newBracket[i][ii]]);
        lby = uby;
      }
      lbx = ubx;
    }
    setMatchPositions(newMatchPositions);
  }, [matches, bracketSize]);

  const allRounds = {
    main: [
      ...new Set(
        matches
          .filter((m) => m.round < 99)
          .map((m) => m.round)
          .sort((a, b) => a - b)
      ),
    ],
  };

  const findTappedItem = (X, Y) => {
    const currentlyTappedMatch = matchPositions.find((p) => {
      const boundaries = p[0];
      return (
        X < boundaries.ubx &&
        X > boundaries.lbx &&
        Y < boundaries.uby &&
        Y > boundaries.lby
      );
    });
    if (currentlyTappedMatch) {
      const relativeY = Y - currentlyTappedMatch[0].lby;
      const areaHeight =
        currentlyTappedMatch[0].uby - currentlyTappedMatch[0].lby;
      const link = linkHeight(bracketSize.matchHeight);
      const selected =
        relativeY < areaHeight / 2 - link / 2
          ? 0
          : relativeY > areaHeight / 2 + link / 2
          ? 1
          : -1;
      return [currentlyTappedMatch, selected];
    } else return [];
  };

  const handleSvgPress = (event, type) => {
    if (
      (type === "short" && !onSelectMatch && !onSelectTeam) ||
      (type === "long" && !onSelectMatchLongPress && !onSelectTeamLongPress)
    ) {
    } else {
      // get the positioning of the tap event and translate it to a team or match tap
      const [currentlyTappedMatch, selected] = findTappedItem(
        event.nativeEvent.locationX,
        event.nativeEvent.locationY
      );
      if (currentlyTappedMatch) {
        if (selected === -1) {
          if (type === "short")
            if (onSelectMatch) return onSelectMatch(currentlyTappedMatch[1]);
            else if (onSelectMatchLongPress)
              return onSelectMatchLongPress(currentlyTappedMatch[1]);
        } else if (type === "short")
          if (onSelectTeam)
            return onSelectTeam(
              currentlyTappedMatch[1],
              teamOrder(flipTeams)[selected]
            );
          else if (onSelectTeamLongPress)
            return onSelectTeamLongPress(
              currentlyTappedMatch[1],
              teamOrder(flipTeams)[selected]
            );
      }
    }
    handleSvgPressOut();
  };

  const handleSvgPressIn = (event) => {
    const [currentlyTappedMatch, selected] = findTappedItem(
      event.nativeEvent.locationX,
      event.nativeEvent.locationY
    );

    // if functions are not set for selecting team/match do not set as pressed
    if (
      (selected < 0 && (onSelectMatch || onSelectMatchLongPress)) ||
      (selected >= 0 && (onSelectTeam || onSelectTeamLongPress))
    )
      if (currentlyTappedMatch) {
        setTappedMatch({
          key: matchKeyCreator(currentlyTappedMatch[1]),
          selected,
        });
      } else handleSvgPressOut();
  };

  const handleSvgPressOut = () => {
    setTappedMatch(null);
  };

  const renderBracket = () => {
    const getRounds = () => {
      const final = Math.max(...allRounds[selectedBracket]);
      return {
        final,
        semi: final - 1,
      };
    };

    let remainingBracketSize = { ...bracketSize };
    const heightOffset =
      selectedBracket === "main"
        ? (allRounds.secondFinal ? bracketSize.matchHeight * 1.6 : 0) +
          (allRounds.thirdFinal ? bracketSize.matchHeight * 1.6 : 0)
        : selectedBracket === "secondary"
        ? bracketSize.matchHeight * 1.6
        : 0;
    remainingBracketSize.height = remainingBracketSize.height - heightOffset;

    return (
      <Svg
        height={bracketSize.height}
        width={bracketSize.width}
        viewBox={`0 0 ${bracketSize.width} ${bracketSize.height}`}
        style={{
          backgroundColor: backgroundColor || defaultBackgroundColor,
          borderRadius: 5,
          border: `1px solid ${popColor || defaultPopColor}`,
          margin: 2,
        }}
        onPress={(event) => handleSvgPress(event, "short")}
        onLongPress={(event) => handleSvgPress(event, "long")}
        onPressIn={handleSvgPressIn}
        onPressOut={handleSvgPressOut}
      >
        {bracket.map((roundMatches, i) => {
          let X = (i * remainingBracketSize.width) / bracket.length;
          return roundMatches.map((m, ii) => {
            const blockStart =
              (ii * remainingBracketSize.height) / roundMatches.length +
              heightOffset;
            const blockEnd =
              ((ii + 1) * remainingBracketSize.height) / roundMatches.length +
              heightOffset;
            let Y = {
              start: blockStart,
              end: blockEnd,
            };
            const bracketEnd =
              ii === 0
                ? "top"
                : ii === roundMatches.length - 1
                ? "bottom"
                : "middle";
            const isFinal = m.round === getRounds().final;
            const isSemiFinal =
              m.round === getRounds().semi && orientation === "landscape";
            const textAnchor =
              orientation === "portrait"
                ? "start"
                : isFinal
                ? "middle"
                : i < bracket.length / 2
                ? "start"
                : "end";
            Y =
              isFinal && orientation === "landscape"
                ? {
                    start: remainingBracketSize.height / 2,
                    end:
                      remainingBracketSize.height / 2 -
                      bracketSize.height / 2 +
                      100,
                  }
                : Y;
            const yMatchStart =
              (Y.end - Y.start) / 2 - bracketSize.matchHeight / 2 + Y.start;
            const matchWidth = remainingBracketSize.width / bracket.length;
            const matchKey = matchKeyCreator(m);
            return (
              <G key={matchKey}>
                <SingleMatch
                  match={m}
                  textAnchor={textAnchor}
                  width={matchWidth}
                  placement={{
                    X,
                    Y: yMatchStart,
                  }}
                  bracketEnd={bracketEnd}
                  isSemiFinal={isSemiFinal}
                  isFinal={isFinal}
                  matchHeight={bracketSize.matchHeight}
                  onSelectMatch={onSelectMatch}
                  onSelectTeam={onSelectTeam}
                  showFullTeamNames={showFullTeamNames}
                  flipTeams={flipTeams}
                  textColor={textColor}
                  backgroundColor={backgroundColor}
                  popColor={popColor}
                  dateTimeFormatter={dateTimeFormatter}
                  lineColor={lineColor}
                  displayMatchNumber={displayMatchNumber}
                  roundCount={roundMatches.length}
                  index={ii}
                  hidePKs={hidePKs}
                  highlightColor={highlightColor}
                  fontSize={bracketSize.fontSize}
                  tappedMatch={tappedMatch}
                  matchKey={matchKey}
                />
                <MatchConnector
                  position={{
                    X,
                    Y: {
                      matchStart: yMatchStart,
                      matchEnd: yMatchStart + bracketSize.matchHeight,
                      blockStart,
                      blockEnd,
                    },
                  }}
                  matchHeight={matchHeight}
                  width={matchWidth}
                  textAnchor={textAnchor}
                  isSemiFinal={isSemiFinal}
                  isFinal={isFinal}
                  orientation={orientation}
                  bracketEnd={bracketEnd}
                  isOnlyMatch={roundMatches.length === 1}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  popColor={popColor}
                  lineColor={lineColor}
                  isDummy={m.dummyMatch}
                  roundCount={roundMatches.length}
                  index={ii}
                  fontSize={bracketSize.fontSize}
                />
              </G>
            );
          });
        })}
      </Svg>
    );
  };

  const onPinch = ({ nativeEvent }) => {
    if (allowPinch) {
      // check for min and max zoom
      const newZoom = nativeEvent.scale * zoom;
      if (checkZoomLevel(newZoom)) {
        if (setManualZoom) setManualZoom(newZoom);
        setZoom(newZoom);
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <PinchGestureHandler onGestureEvent={onPinch}>
        <ScrollView style={styles.verticalScroll}>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {renderBracket()}
          </ScrollView>
        </ScrollView>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  verticalScroll: {},
  horizontalScroll: {
    padding: 5,
  },
});
export default TournamentBracket;
