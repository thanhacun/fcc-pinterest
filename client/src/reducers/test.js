const initState = {name: "Thanh"};
const testReducer = function(state = initState, action) {
    switch (action.type) {
        case 'FLIP_NAME':
            console.log(action);
            return {
                ...state,
                name: action.name == 'Thanh' ? 'Ha': 'Thanh'
             };
        default:
            return state;
    }
};

export default testReducer;