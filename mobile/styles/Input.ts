import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class InputStyle {
  static createBasicInputStyle() {
    return StyleSheet.create({
      input: {
        width: 300,
        height: 34,
        borderWidth: 0.5,
        borderColor: COLORS.BLACK,
        borderRadius: 10,
        padding: 10,
        margin: 6,
      },
    }).input;
  }

  static createOTPInputStyle() {
    let otpInput = StyleSheet.create({
      otpInput: {
        width: 200,
        fontSize: 16,
        letterSpacing: 10,
        textAlign: 'center',
      },
    }).otpInput;
    return StyleSheet.compose(this.createBasicInputStyle(), otpInput);
  }

  static createDropdownStyle() {
    let dropdown = StyleSheet.create({
      dropdown: {
        width: '90%',
        height: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    }).dropdown;
    return StyleSheet.compose(this.createBasicInputStyle(), dropdown);
  }
}
