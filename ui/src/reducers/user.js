const user = (state = null, action) => {
  switch (action.type) {
    case 'SAVE_USER':
      return action.user;
    case 'REMOVE_USER':
      return null;
    default:
      return state;
  };
}

export default user;