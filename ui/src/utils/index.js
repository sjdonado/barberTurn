module.exports.getFileUrl = (file, callback) => {
  const reader = new FileReader();
  try {
    reader.readAsDataURL(file);
    reader.onload = () => {
      callback(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      callback(error);
    }
  } catch(err) {
    callback(err);
  }
};
