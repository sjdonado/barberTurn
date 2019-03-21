export const saveUser = user => ({
  type: 'SAVE_USER',
  user,
});

export const removeUser = user => ({
  type: 'REMOVE_USER',
  user,
});

export const saveProduct = product => ({
  type: 'SAVE_PRODUCT',
  product,
});

export const removeProduct = product => ({
  type: 'REMOVE_PRODUCT',
  product,
});
