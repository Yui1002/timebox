import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    flex: 1,
  },
  statusBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '10%',
    width: '100%',
  },
  subContainer: {
    marginTop: 20,
  },
  header: {
    height: '10%'
  },
  headerText: {
    fontSize: 22, 
    fontWeight: 500,
  },
  align: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  margin: {
    marginTop: 20,
  },
  width: {
    width: '50%',
  },
  font_1: {
    fontSize: 14,
  },
  font_2: {
    fontSize: 18,
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
    fontWeight: '400',
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
  },
  addButton: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    width: '50%',
    margin: 'auto',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workShiftsBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 50,
  },
  workShiftsBtn_back: {
    backgroundColor: '#909090', 
    width: '40%', 
    borderRadius: 10
  },
  workShiftsBtn_add: {
    backgroundColor: '#24a0ed', 
    width: '40%', 
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    lineHeight: 32
  },
  mode: {
    width: '40%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  modeText: {
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
  },
  open: {
    zIndex: -1, 
    height: '26%', 
    marginTop: 30
  },
  close: {
    zIndex: 1, 
    height: '26%', 
    marginTop: 30
  },
  optionContainer: {
    height: '20%'
  },
  optionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    height: '40%',
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  editText: {
    color: '#24a0ed', 
    textDecorationLine: 'underline'
  }
});
