import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class ContainerStyle {
  static createBasicContainerStyle() {
    return StyleSheet.create({
      container: {
        marginVertical: 8,
      },
    }).container;
  }

  static createTopContainerStyle() {
    return StyleSheet.create({
      topContainer: {
        flex: 1,
        alignItems: 'center',
        margin: '5%',
      },
    }).topContainer;
  }

  static createButtonContainerStyle() {
    let buttonContainer = StyleSheet.create({
      buttonContainer: {
        marginVertical: 20,
      },
    }).buttonContainer;
    return StyleSheet.compose(
      this.createBasicContainerStyle(),
      buttonContainer,
    );
  }

  static createAlignTopContainer() {
    let alignContainer = StyleSheet.create({
      alignContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    }).alignContainer;
    return StyleSheet.compose(this.createBasicContainerStyle(), alignContainer);
  }

  static createAlignContainer() {
    let alignContainer = StyleSheet.create({
      alignContainer: {
        width: '50%',
      },
    }).alignContainer;
    return StyleSheet.compose(this.createBasicContainerStyle(), alignContainer);
  }

  static createErrorContainerStyle() {
    return StyleSheet.create({
      errContainer: {
        width: 300,
        height: 30,
        backgroundColor: COLORS.PINK,
        borderRadius: 6,
        flexDirection: 'row',
      },
    }).errContainer;
  }

  static createListContainerStyle() {
    let list = StyleSheet.create({
      list: {
        flexDirection: 'row',
      },
    }).list;
    return StyleSheet.compose(this.createBasicContainerStyle(), list);
  }

  static createListSubContainerStyle() {
    return StyleSheet.create({
      listSub: {
        width: '75%',
        height: 60,
        backgroundColor: COLORS.LIGHT_GREY,
        padding: 10,
        borderRadius: 4
      }
    }).listSub
  }
}
