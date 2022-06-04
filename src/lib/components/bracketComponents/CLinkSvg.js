import React from "react";
import { StyleSheet } from "react-native";
import { Text, Symbol } from "react-native-svg";

import { defaultTextColor } from "../../utils/defaultStyles";

function CLinkSvg({
  x,
  y,
  onMouseOver,
  onMouseOut,
  style,
  boldText,
  children,
  testID,
  fontSize,
}) {
  return (
    <Text
      onResponderMove={() => {}}
      style={{ fontWeight: boldText ? "bold" : "normal" }}
      data-testid={testID}
      x={x}
      y={y}
      fill={style?.fill || defaultTextColor}
      fontSize={fontSize}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CLinkSvg;
