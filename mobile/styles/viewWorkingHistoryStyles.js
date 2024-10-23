import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '94%'
  },
  subHeader: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 4
  },
  dropdown: {
    width: '44%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  dropdownText: {
    lineHeight: 36, 
    paddingLeft: 10
  },
  align: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchBtn: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    height: 30,
    marginTop: 20,
    marginBottom: 30
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 30,
  },
  separator: {
    width: '100%',
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noMatchFound: {
    textAlign: 'center',
    fontSize: 14
  }

});
