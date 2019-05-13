const product = (state = null, action) => {
  switch (action.type) {
    case 'SAVE_PRODUCT':
      return action.product
    case 'REMOVE_PRODUCT':
      return null
    default:
      return state;
  };
}

export default product;