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

  static createInputContainerStyle() {
    let container = StyleSheet.create({
      container: {
        margin: 'auto'
      }
    }).container
    return StyleSheet.compose(this.createBasicContainerStyle(), container);
  }

  static createTopContainerStyle() {
    return StyleSheet.create({
      topContainer: {
        flex: 1,
        margin: '5%',
      },
    }).topContainer;
  }

  static createButtonContainerStyle() {
    let buttonContainer = StyleSheet.create({
      buttonContainer: {
        alignItems: 'center',
        marginVertical: 20,
      },
    }).buttonContainer;
    return StyleSheet.compose(
      this.createBasicContainerStyle(),
      buttonContainer,
    );
  }

  static createAlignedButtonContainerStyle() {
    let buttonContainer = StyleSheet.create({
      buttonContainer: {
        width: '50%',
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
        width: '46%',
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
        width: '100%',
        flexDirection: 'row',
      },
    }).list;
    return StyleSheet.compose(this.createBasicContainerStyle(), list);
  }

  static createListSubContainerStyle() {
    return StyleSheet.create({
      listSub: {
        width: '75%',
        height: 'auto',
        backgroundColor: COLORS.LIGHT_GREY,
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center'
      }
    }).listSub
  }

  static createListSubContainerStyle2() {
    return StyleSheet.create({
      listSub: {
        width: '50%',
        height: 'auto',
        backgroundColor: COLORS.LIGHT_GREY,
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center'
      }
    }).listSub
  }

  static createProgressBarContainer() {
    let progressBar = StyleSheet.create({
      progressBar: {
        width: '33%'
      },
    }).progressBar;
    return StyleSheet.compose(this.createBasicContainerStyle(), progressBar);
  }

  static createCheckboxContainer() {
    let checkbox = StyleSheet.create({
      checkbox: {
        marginLeft: 'auto'
      }
    }).checkbox;
    return StyleSheet.compose(this.createListContainerStyle(), checkbox)
  }

  static createWrapContainer() {
    let container = StyleSheet.create({
      container: {
        width: '100%',
        height: 130,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }
    }).container;
    return StyleSheet.compose(this.createBasicContainerStyle(), container);
  }

  static createDropdownContainer() {
    let container = StyleSheet.create({
      container: {
        flexDirection: 'row', 
        width: '100%', 
        height: 70
      }
    }).container;
    return StyleSheet.compose(this.createBasicContainerStyle(), container);
  }

  static createCheckBoxContainer() {
    let container = StyleSheet.create({
      container: {
        justifyContent: 'flex-end'
      }
    }).container;
    return StyleSheet.compose(this.createAlignTopContainer(), container);
  }
}
