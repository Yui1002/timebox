import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class TextStyle {
  static createBasicTextStyle() {
    return StyleSheet.create({
      text: {
        color: COLORS.BLACK,
        fontSize: 16,
      },
    }).text;
  }

  static createHeaderTextStyle() {
    let header = StyleSheet.create({
      header: {
        fontSize: 22,
        fontWeight: '500',
      },
    }).header;
    return StyleSheet.compose(this.createBasicTextStyle(), header);
  }

  static createTitleTextStyle() {
    let title = StyleSheet.create({
      title: {
        fontSize: 18,
        fontWeight: '500',
      },
    }).title;
    return StyleSheet.compose(this.createBasicTextStyle(), title);
  }

  static createButtonTextStyle() {
    let buttonText = StyleSheet.create({
      buttonText: {
        color: COLORS.WHITE,
      },
    }).buttonText;
    return StyleSheet.compose(this.createBasicTextStyle(), buttonText);
  }

  static createLinkTextStyle() {
    return StyleSheet.create({
      link: {
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.BLACK,
      },
    }).link;
  }

  static createDeleteLinkTextStyle() {
    let link = StyleSheet.create({
      link: {
        color: COLORS.BLUE,
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.BLUE,
      },
    }).link;
    return StyleSheet.compose(this.createLinkTextStyle(), link);
  }

  static createToggleTextStyle() {
    return StyleSheet.create({
      toggle: {
        position: 'absolute',
        top: '32%',
        right: '8%',
      },
    }).toggle;
  }

  static createErrorTextStyle() {
    return StyleSheet.create({
      error: {
        fontWeight: '500',
        lineHeight: 30,
        paddingHorizontal: 6,
      },
    }).error;
  }

  static createDropdownTextStyle() {
    let dropdownText = StyleSheet.create({
      dropdownText: {
        width: '70%',
        textAlign: 'center'
      }
    }).dropdownText;
    return StyleSheet.compose(this.createBasicTextStyle(), dropdownText);
  }

  static createBarTextStyle() {
    let barText = StyleSheet.create({
      barText: {
        fontWeight: '500',
        textAlign: 'center'
      }
    }).barText;
    return StyleSheet.compose(this.createBasicTextStyle(), barText);
  }

  static createCustomWidthTextStyle(width: any) {
    let text = StyleSheet.create({
      text: {
        width: width
      }
    }).text;
    return StyleSheet.compose(this.createBasicTextStyle(), text);
  }

  static createCenterTextStyle() {
    let text = StyleSheet.create({
      text: {
        textAlign: 'center'
      }
    }).text;
    return StyleSheet.compose(this.createBasicTextStyle(), text);
  }

  static createRightTopTextStyle() {
    return StyleSheet.create({
      text: {
        fontSize: 12,
        color: COLORS.DARK_GRAY,
        marginLeft: 'auto',
        marginRight: 0
      }
    }).text;
  }

  static createProfileTextStyle() {
    return StyleSheet.create({
      text: {
        fontWeight: '500',
        fontSize: 22,
        textAlign: 'center'
      }
    }).text
  }
}
