import {StyleSheet} from 'react-native';
import { COLORS, FONT_WEIGHT } from './theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sub_container: {
    width: '33%',
  },
  title: {
    textAlign: 'center',
    fontWeight: FONT_WEIGHT.primary
  },
  bar: {
    height: '12%',
    backgroundColor: COLORS.button2,
  },
  bar_focused: {
    backgroundColor: COLORS.button1
  }
});
