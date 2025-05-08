export const addShift = (shift) => {
  return {
    type: 'ADD_SHIFT',
    payload: shift,
  };
};

export const updateShift = (shift) => {
  return {
    type: 'UPDATE_SHIFT',
    payload: shift
  }
}

export const deleteShift = (day) => {
  return {
    type: 'DELETE_SHIFT',
    payload: day,
  }
}

export const resetShifts = () => {
  return {
    type: 'RESET_SHIFTS',
  }
}

