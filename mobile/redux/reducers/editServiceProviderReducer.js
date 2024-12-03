const initialState = {
    serviceProviderData: {
        first_name: '',
        last_name: '',
        email: '',
        status: '',
        rate: 0,
        rate_type: '',
        schedule: []
    }
}

const editServiceProviderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'EDIT':
            return action.payload;
        default: 
            return state;
    }
}

export default editServiceProviderReducer;