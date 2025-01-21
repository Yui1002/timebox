import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class ButtonStyle {
  static createBasicButtonStyle() {
    return StyleSheet.create({
      button: {
        width: 300,
        height: 34,
        backgroundColor: COLORS.BLUE,
        borderRadius: 10,
      },
    }).button;
  }

  static createRecordButtonStyle() {
    let record = StyleSheet.create({
      record: {
        width: '25%',
        height: 60,
        borderRadius: 4,
      }
    }).record;
    return StyleSheet.compose(this.createBasicButtonStyle(), record);
  }

  static createContinueButtonStyle() {
    let button = StyleSheet.create({
      button: {
        width: '45%',
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }

  static createBackButtonStyle() {
    let button = StyleSheet.create({
      button: {
        width: '45%',
        backgroundColor: COLORS.LIGHT_GREY
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }

  static createMediumButtonStyle2() {
    let button = StyleSheet.create({
      button: {
        width: '50%',
        backgroundColor: COLORS.LIGHT_GREY
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }
}
