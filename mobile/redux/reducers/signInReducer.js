const initialState = {
    userInfo: {
        firstName: '',
        lastName: '',
        email: ''
    },
  };
  
  const signInReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SIGN_IN':
        return action.payload;
      case 'SIGN_OUT': 
        return state;
      default:
        return state;
    }
  };
  
  export default signInReducer;
  