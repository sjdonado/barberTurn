const promotion = (state = null, action) => {
  switch (action.type) {
    case 'SAVE_PROMOTION':
      return action.promotion
    case 'REMOVE_PROMOTION':
      return null
    default:
      return state;
  };
}

export default promotion;