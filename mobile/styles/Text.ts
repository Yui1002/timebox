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

  static createRecordButtonTextStyle() {
    let buttonText = StyleSheet.create({
      buttonText: {
        lineHeight: 60,
      },
    }).buttonText;
    return StyleSheet.compose(this.createButtonTextStyle(), buttonText);
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
        fontWeight: '500',
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
        paddingLeft: 10,
        width: '70%',
        lineHeight: 24
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
}
