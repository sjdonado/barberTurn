module.exports.getFileUrl = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
    reader.onload = () => {
      callback(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      callback(error);
    }
};
