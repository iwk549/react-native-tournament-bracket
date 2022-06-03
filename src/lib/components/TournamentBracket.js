import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import Svg, { G } from "react-native-svg";
import { PinchGestureHandler } from "react-native-gesture-handler";

import { separateAndSplit } from "../utils/bracketUtils";
import {
  defaultBackgroundColor,
  defaultHighlight,
  defaultPopColor,
  defaultTextColor,
} from "../utils/defaultStyles";
import SingleMatch from "./bracketComponents/SingleMatch";
import MatchConnector from "./bracketComponents/MatchConnector";

function TournamentBracket({
  matches,
  onSelectMatch,
  onSelectTeam,
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
}) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const [bracketSize, setBracketSize] = useState({
    width: screenWidth,
    height: screenHeight,
    matchHeight: 100,
    fontSize: 12,
  });

  useEffect(() => {
    const newMatchHeight =
      matchHeight || (orientation === "portrait" ? 100 : 100);
    setBracketSize({
      width: width || 1200,
      height: height || 720,
      matchHeight: newMatchHeight,
      fontSize: newMatchHeight * 0.16,
    });
  }, [orientation, width, height, matchHeight]);

  // ! start pinching code

  const handleStateChange = (event) => {
    console.log("state changed");
  };

  const onPinch = (event) => {
    console.log("pinched");
  };

  // ! end pinching code

  const allRounds = {
    main: [
      ...new Set(
        matches
          .filter((m) => m.round > 0 && m.round <= 10)
          .map((m) => m.round)
          .sort((a, b) => a - b)
      ),
    ],
  };

  const renderBracket = () => {
    const bracket = separateAndSplit(
      allRounds,
      selectedBracket,
      matches,
      orientation === "landscape",
      disableStrictBracketSizing
    );

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
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={(event) => console.log(event.nativeEvent)}
      >
        <Svg
          height={bracketSize.height}
          width={bracketSize.width}
          // viewBox="0 0 100 100"
          style={{
            backgroundColor: backgroundColor || defaultBackgroundColor,
            borderRadius: 5,
            border: `1px solid ${popColor || defaultPopColor}`,
          }}
          // onPress={(event) => console.log(event.nativeEvent)}
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

              return (
                <G key={matchKeyCreator(m)}>
                  <SingleMatch
                    match={m}
                    textAnchor={textAnchor}
                    width={matchWidth}
                    placement={{ X, Y: yMatchStart }}
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
      </TouchableOpacity>
    );
  };

  //   return (
  //     <PinchGestureHandler
  //       onGestureEvent={onPinch}
  //       onHandlerStateChange={handleStateChange}
  //       enabled={true}
  //     >
  //       <View style={{ height: 500, width: 500, backgroundColor: "green" }} />
  //     </PinchGestureHandler>
  //   );
  return (
    <ScrollView
      style={styles.verticalScroll}
      onPinch={() => console.log("pinched")}
    >
      <ScrollView horizontal={true} style={styles.horizontalScroll}>
        {renderBracket()}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  verticalScroll: {},
  horizontalScroll: {
    padding: 5,
  },
});

export default TournamentBracket;
