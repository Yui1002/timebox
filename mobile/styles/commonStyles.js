import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export const common = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: '5%',
  },
});

export default class StyleSheetFactory {
  static setButton(width, height, color, bWidth = 0, bColor = COLORS.text1) {
    return StyleSheet.create({
      button: {
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: 10,
        borderWidth: bWidth,
        borderColor: bColor
      },
    });
  }

  static setFontSize(fontSize) {
    return StyleSheet.create({
      fontSize: fontSize,
    });
  }

  static setWidth(width) {
    return StyleSheet.create({
      width: width,
    });
  }

  static setMargin(margin) {
    return StyleSheet.create({
      marginVertical: margin,
    });
  }

  static setAlign() {
    return StyleSheet.create({
      flexDirection: 'row',
      justifyContent: 'space-between',
    });
  }
}
