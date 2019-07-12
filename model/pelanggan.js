const mongoose = require('mongoose');
const pelangganSchema = mongoose.Schema({
    kodepelanggan   : {type: String, unique: true},
    namapelanggan  	: String,
    alamat       	: String,
    telepon	        : String,
    email	        : String,
    created_at		: String
});
module.exports = mongoose.model('pelanggan', pelangganSchema);