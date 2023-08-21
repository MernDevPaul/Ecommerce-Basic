const mongoose = require("mongoose");
const validateId = (id, meg) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error(`${meg ?? "This"} id is Invalid!`);
};
module.exports = validateId;
