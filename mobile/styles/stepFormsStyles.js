import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '100%'
  },
  header: {
    marginVertical: 20,
    fontSize: 24
  },
  statusBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workShiftsContainer: {
    marginTop: 30
  },
  title: {
    marginVertical: 4, 
    fontWeight: '500'
  },
  dayContainer: {
    width: '100%',
    height: 130,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    width: 100,
    height: 30,
    marginVertical: 4,
  },
  day_selected: {
    backgroundColor: '#24a0ed',
    borderRadius: 20,
    width: 100,
    height: 30,
    marginVertical: 4,
  },
  day_text: {
    color: '#fff',
    padding: 6,
    textAlign: 'center',
    fontWeight: 400,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleHeader: {
    fontWeight: '500'
  },
  startText: {
    borderBottomWidth: 1,
    paddingTop: 10,
    borderBottomColor: '#ccc',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrow: {
    width: 10,
    height: 10,
    borderTopWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    borderColor: '#000',
    padding: 2,
    transform: 'rotate(45deg)',
  },
  delete: {
    color: '#24a0ed',
    width: '20%',
    textDecorationLine: 'underline',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  }
});
