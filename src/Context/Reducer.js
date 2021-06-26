export const initialState = {
  user: null,
  username: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_USERNAME: "SET_USERNAME",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action?.user,
      };
    case actionTypes.SET_USERNAME:
      return {
        ...state,
        username: action?.username,
      };

    default:
      return state;
  }
};

export default reducer;
