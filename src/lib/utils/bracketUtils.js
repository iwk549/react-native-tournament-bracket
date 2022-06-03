export function isExponentOfTwo(n) {
  return Math.log2(n) % 1 === 0;
}

export const offsets = { text: 10, lines: 5, pixels: 2 };

export const getTextX = (textAnchor, width) => {
  return textAnchor === "start"
    ? offsets.text
    : textAnchor === "end"
    ? width - offsets.text
    : width / 2;
};
export const getLineX = (textAnchor, width) => {
  return textAnchor === "start"
    ? offsets.lines
    : textAnchor === "end"
    ? width - offsets.lines
    : width / 2;
};

export const separateAndSplit = (
  allRounds,
  bracket,
  matches,
  split,
  disableStrictBracketSizing
) => {
  let leftMatches = [];
  let rightMatches = [];
  let allMatches = [];
  const roundsToShow = allRounds[bracket];
  let lastRoundSize;
  const toDisableMessage =
    "To disable this error set the strictBracketSizing prop to false.";
  roundsToShow.forEach((r) => {
    const roundMatches = [
      ...matches
        .filter((m) => m.round === r)
        .sort((a, b) => a.matchNumber - b.matchNumber),
    ];
    if (!disableStrictBracketSizing) {
      if (lastRoundSize) {
        if (lastRoundSize / 2 !== roundMatches.length)
          throw new Error(
            "The length of each round must be half of the previous round. " +
              toDisableMessage
          );
      }
      lastRoundSize = roundMatches.length;
      if (!isExponentOfTwo(lastRoundSize))
        throw new Error(
          "The length of each round must be an exponentiation of two. " +
            toDisableMessage
        );
    }
    if (roundMatches.some((m) => !m.dummyMatch)) {
      allMatches.push(roundMatches);
      const splitMatches = [...roundMatches];
      const lefts = splitMatches.splice(0, roundMatches.length / 2);
      const rights = splitMatches;
      leftMatches.push(lefts);
      rightMatches.push(rights);
    }
  });
  leftMatches = leftMatches.slice(0, leftMatches.length - 1);
  [leftMatches, rightMatches].forEach((arr) => {
    arr.forEach((round, idx) => {
      if (!round.some((m) => !m.dummyMatch)) {
        arr.splice(idx, 1);
      }
    });
  });
  if (split) return [...leftMatches, ...rightMatches.reverse()];
  else return allMatches;
};

export const getTeamNameYPlacement = (verticalPosition, height) => {
  // verticalPosition (0 or 1, index of home/away team)
  return verticalPosition === 0 ? height / 3 : (height * 4) / 5;
};

export const matchHeight = 100;

export const getFinalRound = (bracket) => {
  if (bracket.length === 0) return 0;
  return Math.max(...bracket.map((m) => m.round));
};
