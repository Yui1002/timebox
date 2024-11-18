export const signInUser = data => {
  console.log('action data', data)
  return {
    type: 'SIGN_IN',
    payload: data,
  };
};

export const signOutUser = data => {
  return {
    type: 'SIGN_OUT',
    payload: data
  }
}
