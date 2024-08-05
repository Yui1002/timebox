export const signInUser = data => {
  return {
    type: 'SIGN_IN',
    payload: data,
  };
};
