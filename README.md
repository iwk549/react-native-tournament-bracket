# react-native-tournament-bracket

Tournament brackets for mobile

This package is currently in beta and as such is not ready for production use. The ReadMe will not be filled out until actual release.

The component uses most of the same props and functionality as it's sister React package. This can be found at https://www.npmjs.com/package/react-svg-tournament-bracket.

Here are some of the extra props included in the Native package:

| Prop Name              | Type             | Description                                                                                                                                                                                  |
| ---------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| manualZoom             | Number           | Bracket can be pinched to zoom in and out, but if you want to be able to set and reset the zoom level with a button or slider you can use this prop. Allowable values are between 0.5 and 3. |
| setManualZoom          | Function => void | Callback used to listen to the pinch event and track the zoom level when pinched. Also used in conjunction with manualZoom to set a custom zoom level.                                       |
| allowPinch             | Boolean          | Set to true by default, can be set to false to prevent the user from being able to pinch to zoom                                                                                             |
| onSelectMatchLongPress | Function => void | Callback which captures a long press on the match link between two teams. Same signature as onSelectMatch.                                                                                   |
| onSelectTeamLongPress  | Function => void | Callback which captures a long press on a team. Same signature as onSelectTeam.                                                                                                              |
