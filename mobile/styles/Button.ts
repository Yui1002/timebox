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
        width: '100%'
      }
    }).record;
    return StyleSheet.compose(this.createBasicButtonStyle(), record);
  }

  static createSaveRecordButtonStyle() {
    let record = StyleSheet.create({
      record: {
        width: '50%'
      }
    }).record;
    return StyleSheet.compose(this.createBasicButtonStyle(), record);
  }
}
