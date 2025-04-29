import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class ButtonStyle {
  static createBasicButtonStyle(width: any, height: any, color: string = COLORS.BLUE) {
    return StyleSheet.create({
      button: {
        width: width,
        height: height,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      },
    }).button;
  }

  static createSaveButtonStyle() {
    let button = StyleSheet.create({
      button: {
        backgroundColor: COLORS.ORANGE
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }

  static createRecordButtonStyle(disabled?: boolean) {
    let record = StyleSheet.create({
      record: {
        width: '25%',
        height: 'auto',
        borderRadius: 4,
        backgroundColor: disabled ? COLORS.LIGHT_GREY : COLORS.BLUE
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

  static createSelectedDayButtonStyle() {
    let button = StyleSheet.create({
      button: {
        borderRadius: 20,
        width: 100,
        height: 30,
        marginVertical: 4,
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }

  static createDayButtonStyle() {
    let button = StyleSheet.create({
      button: {
        borderRadius: 20,
        width: 100,
        height: 30,
        marginVertical: 4,
        backgroundColor: COLORS.LIGHT_GREY
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }

  static createDeclineButtonStyle() {
    let button = StyleSheet.create({
      button: {
        width: '45%',
        backgroundColor: COLORS.RED
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }

  static createAcceptButtonStyle() {
    let button = StyleSheet.create({
      button: {
        width: '45%',
        backgroundColor: COLORS.GREEN
      }
    }).button;
    return StyleSheet.compose(this.createBasicButtonStyle(), button);
  }
}
