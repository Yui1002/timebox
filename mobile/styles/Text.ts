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

  static createButtonTextStyle() {
    let buttonText = StyleSheet.create({
      buttonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 34,
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

  static createToggleTextStyle() {
    return StyleSheet.create({
      toggle: {
        position: 'absolute',
        top: '32%',
        right: '8%',
      },
    }).toggle;
  }

  static createHeaderTextStyle() {
    let header = StyleSheet.create({
      header: {
        fontSize: 22,
        fontWeight: '500',
        color: COLORS.BLACK,
      },
    }).header;
    return StyleSheet.compose(this.createBasicTextStyle(), header);
  }

  static createTitleTextStyle() {
    let title = StyleSheet.create({
      title: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.BLACK,
      },
    }).title;
    return StyleSheet.compose(this.createBasicTextStyle(), title);
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
        color: COLORS.BLACK,
        lineHeight: 35,
        paddingLeft: 10,
        fontSize: 16,
      }
    }).dropdownText;
    return StyleSheet.compose(this.createBasicTextStyle(), dropdownText);
  }
}
