import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class SeparatorStyle {
  static createBasicSeparatorStyle() {
    return StyleSheet.create({
      separator: {
        width: '100%',
        marginVertical: 8,
        borderBottomColor: COLORS.BLACK,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }).separator;
  }
}
