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
    return StyleSheet.create({
      dropdown: {
        width: '75%',
        height: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
      },
    }).dropdown;
  }

  
  static createDropdown2Style() {
    let dropdown = StyleSheet.create({
      dropdown: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }
    }).dropdown;
    return StyleSheet.compose(this.createBasicInputStyle(), dropdown);
  }
  static createDropdown3Style() {
    return StyleSheet.create({
      dropdown: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }
    }).dropdown;
  }

  static createUnderlineInputStyle() {
    return StyleSheet.create({
      input: {
        width: 100,
        borderBottomWidth: 1,
        padding: 8,
        paddingTop: 14
      }
    }).input
  }

}
