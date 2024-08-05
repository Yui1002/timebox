const initialState = {
  workShifts: [],
};

const workShiftsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        workShifts: [...state.workShifts, action.payload],
      };
    case 'DELETE':
      return {
        ...state,
        workShifts: state.workShifts.filter(
          s => JSON.stringify(s) !== JSON.stringify(action.payload),
        ),
      };
    default:
      return state;
  }
};

export default workShiftsReducer;
