import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '90%'
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  box: {
    height: '30%',
    backgroundColor: '#E8E8E8',
    position: 'relative',
    borderRadius: 10,
    padding: 14
    // paddingHorizontal: 10,
    // paddingVertical: 14
  },
  timeText: {
    fontSize: 12,
    color: '#707070',
    position: 'absolute',
    top: 40, 
    right: 10
  },
  subContainer: {
    // backgroundColor: '#ddd',
    height: '100%'
  }
});
