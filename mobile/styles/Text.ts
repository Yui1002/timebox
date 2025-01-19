import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export default class TextStyle {
  static createBasicTextStyle() {
    return StyleSheet.create({
      text: {
        color: COLORS.WHITE,
        textAlign: 'center',
        lineHeight: 34,
        fontSize: 18,
      },
    });
  }

  static createLinkTextStyle() {
    return StyleSheet.create({
      link: {
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.BLACK,
      },
    });
  }

  static createToggleTextStyle() {
    return StyleSheet.create({
      toggle: {
        position: 'absolute',
        top: '32%',
        right: '8%',
      },
    });
  }
}
