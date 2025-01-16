import {StyleSheet} from 'react-native';
import { COLORS, FONT_WEIGHT } from './theme';

export const styles = StyleSheet.create({
  error: {
    width: 300,
    height: 30,
    backgroundColor: COLORS.error1,
    borderRadius: 6,
    flexDirection: 'row',
  },
  text: {
    fontWeight: FONT_WEIGHT.primary,
    lineHeight: 30,
    paddingHorizontal: 6,
  }
});
