import {StyleSheet} from 'react-native';
import { COLORS, FONT_WEIGHT } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: '5%',
  },
  header: {
    marginVertical: 14
  },
  headerText: {
    fontSize: 18,
    fontWeight: FONT_WEIGHT.primary,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectSubContainer: {
    width: '50%',
    alignItems: 'center'
  },
  selectBox: {
    borderWidth: 1,
    borderColor: COLORS.separator,
    borderRadius: 8,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
  },
  text: {
    lineHeight: 50,
    paddingLeft: 10,
  },
  icon: {
    lineHeight: 50
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  subButtonContainer: {
    width: '50%',
    alignItems: 'center',
  },
  saveButton: {
    width: '90%',
    backgroundColor: COLORS.button1,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.text1,
    fontSize: 18,
    fontWeight: FONT_WEIGHT.primary,
    lineHeight: 32
  },
});
