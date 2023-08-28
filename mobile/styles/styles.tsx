import {StyleSheet} from 'react-native';

export const common_styles = StyleSheet.create({
  container: {
    margin: '5%',
  },
  sub_container: {
    marginTop: 4,
    marginBottom: 4,
  },
  btn: {
    width: '44%',
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#2089DC',
  },
  error_message: {
    fontSize: 12,
    color: 'red',
  },
  text_decoration: {
    textDecorationColor: '#000',
    textDecorationLine: 'underline',
  },
  divider: {
    marginTop: 10,
  },
});

export const starter_styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export const sign_in_styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input_field: {
    height: 40,
    borderWidth: 1,
    width: '90%',
  },
});

export const add_user_styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  dropDownContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  dropDown: {
    width: '44%',
    marginRight: 6,
  },
  editBtn: {
    width: '80%',
    height: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 20,
    backgroundColor: '#2089DC',
  },
  editBtnText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 20,
  },
});

export const dropdown_styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  btnText: {
    flex: 1,
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '50%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});

export const edit_user_styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    height: '50%',
    position: 'relative',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    // padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  close: {
    width: '100%',
    height: '14%',
    // backgroundColor: 'lightblue',
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 20,
    fontWeight: 'bold',
    width: '10%',
    height: '100%',
    margin: 8,
  },
  first_last_name_input: {
    width: '100%',
    height: '20%',
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  first_name_input: {
    width: '45%',
    padding: 4,
  },
  last_name_input: {
    width: '45%',
    padding: 4,
  },
  input_box: {
    height: 40,
    borderWidth: 1,
    width: '100%',
  },
});

const styles = StyleSheet.create({
  container: {
    margin: '5%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  name_container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  name_sub_container: {
    width: '50%',
  },
  input_name: {
    height: 40,
    borderWidth: 1,
    width: '90%',
  },
  email_container: {
    marginBottom: 10,
  },
  input_email: {
    height: 40,
    borderWidth: 1,
    width: '90%',
  },
  input_password: {
    height: 40,
    borderWidth: 1,
    width: '90%',
  },
  authentication_container: {
    display: 'flex',
    flexDirection: 'row',
  },
  password_container: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 10,
    marginLeft: 10,
  },
  OTP_container: {
    display: 'flex',
    flexDirection: 'row',
  },
  radioBtn: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginLeft: 4,
    backgroundColor: '#000',
  },
  joinBtn: {
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: '#2089DC',
  },
  form_input_error: {
    fontSize: 10,
    color: 'red',
  },
  password_passed: {
    fontSize: 14,
    color: '#5EBA7D',
  },
  password_rejected: {
    fontSize: 14,
    color: 'red',
  },
  register_error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  add_user_container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    // backgroundColor: '#ccc',
  },
  add_user_sub_container: {
    width: '30%',
    marginLeft: 'auto',
    // backgroundColor: 'lightblue',
  },
  add_user_name: {
    height: 30,
    borderWidth: 1,
    width: '90%',
    marginRight: 10,
  },
  add_user_rate_container: {
    width: '40%',
    marginLeft: 'auto',
    // backgroundColor: 'lightblue'
  },
  add_user_btn: {
    width: '30%',
    marginLeft: 'auto',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2089DC',
  },
  setup_container: {
    display: 'flex',
    flexDirection: 'row',
  },
  setup_btn: {
    width: '44%',
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#2089DC',
  },
  list_user_container: {
    // flex: 1,
    // paddingHorizontal: 10,
  },
  list_user_headerBox: {
    flex: 1,
    height: 30,
    width: 20,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderRightColor: '#ccc',
    borderTopColor: '#ccc',
    flexGrow: 1,
    flexBasis: 20,
  },
  list_user_box_text: {
    fontSize: 10,
    textAlign: 'center',
  },
  list_user_box: {
    flex: 1,
    height: 30,
    width: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    flexGrow: 1,
    flexBasis: 48,
  },
  list_user_previewContainer: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  list_user_btn: {
    width: '80%',
    height: '80%',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 20,
    backgroundColor: '#2089DC',
  },
  list_user_btn_text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  }
});

export default styles;
