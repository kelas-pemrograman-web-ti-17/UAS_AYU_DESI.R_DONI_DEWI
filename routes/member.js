var express = require('express');
var crypto = require('crypto');

var User = require('../model/user')
var Sepatu = require('../model/sepatu')
var Pelanggan = require('../model/pelanggan')
var Penjualan = require('../model/penjualan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/datasepatumember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Sepatu.find({}, function(err, sepatu) {
        console.log(sepatu);
        res.render('admin/sepatu/table', { session_store: session_store, sepatus: sepatu })
    }).select('_id kodesepatu merksepatu modelsepatu ukuransepatu stok harga diskon created_at')
});

/* GET users listing. */
router.get('/datapelangganmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Pelanggan.find({}, function(err, pelanggan) {
        console.log(pelanggan);
        res.render('admin/pelanggan/table', { session_store: session_store, pelanggans: pelanggan })
    }).select('_id kodepelanggan namapelanggan alamat telepon email created_at')
});

/* GET users listing. */
router.get('/datapenjualanmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Sepatu.find({}, function(err, sepatu) {
        console.log(sepatu);
        res.render('admin/penjualan/table', { session_store: session_store, penjualans: penjualan })
    }).select('_id nopenjualan tglpenjualan harga jumlah diskon created_at')
});



module.exports = router;