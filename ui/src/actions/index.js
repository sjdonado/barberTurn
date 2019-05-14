export const saveUser = user => ({
  type: 'SAVE_USER',
  user,
});

export const removeUser = user => ({
  type: 'REMOVE_USER',
  user,
});

export const savePromotion = promotion => ({
  type: 'SAVE_PROMOTION',
  promotion,
});

export const removePromotion = promotion => ({
  type: 'REMOVE_PROMOTION',
  promotion,
});
