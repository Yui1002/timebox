export const addShift = data => {
  return {
    type: 'ADD',
    payload: data,
  };
};

export const deleteShift = data => {
  return {
    type: 'DELETE',
    payload: data,
  };
};

export const resetShift = data => {
  return {
    type: 'RESET',
    payload: data,
  }
}
