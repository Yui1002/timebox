import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export default class InputStyle {
  static createBasicInputStyle() {
    return StyleSheet.create({
      input: {
        width: 300,
        height: 34,
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 10,
        margin: 6,
      },
    });
  }

  static createOTPInputStyle() {
    let x = this.createBasicInputStyle().input;
    let y = StyleSheet.create({
      otpInput: {
        width: 200,
        fontSize: 16,
        letterSpacing: 10,
        textAlign: 'center',
      },
    }).otpInput;
    return StyleSheet.compose(x, y);
  }
}
