import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export default class ContainerStyle {
  static createBasicContainerStyle() {
    return StyleSheet.create({
      container: {
        marginVertical: 8,
      },
    });
  }

  static createTopContainerStyle() {
    return StyleSheet.create({
      topContainer: {
        flex: 1,
        alignItems: 'center',
        margin: '5%',
      },
    });
  }

  static createFooterStyle() {
    let x = this.createBasicContainerStyle().container;
    let y = StyleSheet.create({
      footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    }).footer;
    let footer = StyleSheet.compose(x, y)
    return footer;
  }
}
