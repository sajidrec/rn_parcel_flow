import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ButtonComponent = ({
  title = "Button",
  onPress = () => { },
  bgColor = "#007bff",
  textColor = "#fff",
  width = '100%',
  height = 50,
  borderRadius = 8,
  style = {},
  textStyle = {},
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ButtonComponent;