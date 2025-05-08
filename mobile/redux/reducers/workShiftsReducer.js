const initialState = [];

const workShiftsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SHIFT':
      return [...state, action.payload];
    case 'UPDATE_SHIFT':
      return state.map(shift =>
        shift.day === action.payload.day ? action.payload : shift,
      );
    case 'DELETE_SHIFT':
      return state.filter((shift) => shift.day !== action.payload); 
    case 'RESET_SHIFTS':
      return [];
    default:
      return state;
  }
};

export default workShiftsReducer;
