import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class IconStyle {
  static createBasicIconStyle() {
    return StyleSheet.create({
      icon: {
        width: '20%',
      },
    }).icon;
  }

  static createProgressBar() {
    return StyleSheet.create({
      progressBar: {
        backgroundColor: COLORS.LIGHT_GREY,
        height: 10,
      },
    }).progressBar;
  }

  static createProgressBarFocused() {
    return StyleSheet.create({
      progressBar: {
        backgroundColor: COLORS.BLUE,
        height: 10,
      },
    }).progressBar;
  }

  static createProfileIconStyle() {
    return StyleSheet.create({
      icon: {
        textAlign: 'center',
      },
    }).icon;
  }

  static createAlignProfileIconStyle() {
    return StyleSheet.create({
      icon: {
        width: '50%',
        textAlign: 'center',
      },
    }).icon;
  }
}
