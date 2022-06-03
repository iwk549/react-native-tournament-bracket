import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-svg";

import AppText from "../AppText";

function CLinkSvg({
  x,
  y,
  onMouseOver,
  onMouseOut,
  style,
  clickHandler,
  boldText,
  children,
  testID,
  transform,
}) {
  return (
    <Text
      transform={transform}
      onClick={!clickHandler ? () => {} : clickHandler}
      style={{ fontWeight: "bold" }}
      data-testid={testID}
    >
      <AppText
        style={{
          fontWeight: boldText ? "bold" : "normal",
        }}
      >
        {children}
      </AppText>
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CLinkSvg;
