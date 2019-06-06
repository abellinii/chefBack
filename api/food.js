 const mongoose=require('mongoose');
 const Schema = mongoose.Schema;

;



const foodSchema = new Schema({
_id: String,
cuisines:[String],
flavors: [String],
types: [String],
options: [String],

});

module.exports = mongoose.model('Food', foodSchema);

