const initialState = {
  workShifts: [],
};

const manageShiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MANAGE':
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
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export default manageShiftReducer;
