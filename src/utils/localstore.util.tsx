const localStoreUtil = {
  store_data: (key:any, data:any) => {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  },

  get_data: (key:any) => {
    const item = localStorage.getItem(key);

    if (!item) return;
    return JSON.parse(item);
  },

  remove_data: (key:any) => {
    localStorage.removeItem(key);
    return true;
  },

  remove_all: () => {
    localStorage.clear();
    return true;
  },
};

export default localStoreUtil;
