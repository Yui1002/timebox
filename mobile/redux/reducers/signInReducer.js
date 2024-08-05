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
        return action.payload
      default:
        return state;
    }
  };
  
  export default signInReducer;
  