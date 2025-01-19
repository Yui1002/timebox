import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export class TestStyleSheet {
    static createBasicButtonStyle() {
        return StyleSheet.create({
            button: {
                width: 10,
                height: 10,
                backgroundColor: 'black',
                borderRadius: 10
            }
        })
    }

    static createExitButton() {
        return StyleSheet.create({
            baseButton: this.createBasicButtonStyle(),
            exitButton: {
                color: 'Pink'
            }
        })
    }
}

export default class StyleSheetFactory {
  static setContainer() {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        margin: '5%',
      },
    });
  }
  static setButton(width, height, color, bWidth = 0, bColor = COLORS.text1) {
    return StyleSheet.create({
      button: {
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: 10,
        borderWidth: bWidth,
        borderColor: bColor,
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

  static setText(color, fontSize, lineHeight, textAlign = 'center') {
    let x= StyleSheet.create({
      text: {
        color: color,
        lineHeight: lineHeight,
        textAlign: textAlign,
      },
    });
    let y = StyleSheet.compose(this.setFontSize(fontSize), x)
    return y;
  }

  static setColor(color, bColor) {
    StyleSheet.compose
    return StyleSheet.create({
      color: {
        color: color,
        backgroundColor: bColor,
      },
    });
  }

  static setInput(width, height, bWidth, bRadius, padding, margin) {
    return StyleSheet.create({
        input: {
            width: width,
            height: height,
            borderWidth: bWidth,
            borderRadius: bRadius,
            padding: padding,
            margin: margin,
        }
    })
  }
}
