const mongoose = require('mongoose');
const sepatuSchema = mongoose.Schema({
    kodesepatu      : {type: String, unique: true},
    merksepatu 		: String,
    modelsepatu 	: String,
    ukuransepatu	: String,
    stok	        : String,
    harga	        : String,
    diskon          : String,
    created_at		: String
});
module.exports = mongoose.model('sepatu', sepatuSchema);