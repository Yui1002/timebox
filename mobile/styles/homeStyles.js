import {StyleSheet} from 'react-native';
import { COLORS, FONT_WEIGHT } from './theme';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: '5%',
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: FONT_WEIGHT.secondary,
    marginVertical: 8
  },
  title: {
    fontSize: 16, 
    fontWeight: FONT_WEIGHT.primary,
    marginVertical: 8
  },
  nameTitle: {
    fontSize: 16, 
    fontWeight: FONT_WEIGHT.primary
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background1,
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  button: {
    backgroundColor: COLORS.button1,
    borderRadius: 10,
    width: 70
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.text1,
    fontSize: 18,
    lineHeight: 32
  },
});
