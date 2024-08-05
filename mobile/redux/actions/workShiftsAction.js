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
