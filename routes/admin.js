var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Sepatu = require('../model/sepatu')
var Pelanggan = require('../model/pelanggan')
var Penjualan = require('../model/penjualan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/datasepatu', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Sepatu.find({}, function(err, sepatu) {
        //console.log(sepatu);
        res.render('admin/sepatu/table', { session_store: session_store, sepatus: sepatu })
    }).select('_id kodesepatu merksepatu modelsepatu ukuransepatu stok harga diskon created_at')
});

/* GET users listing. */
router.get('/inputsepatu', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/sepatu/input_data', { session_store: session_store})
});

//input data sepatu
router.post('/inputsepatu', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Sepatu.find({ kodesepatu: req.body.kodesepatu }, function(err, sepatu) {
        if (sepatu.length == 0) {
            var datasepatu = new Sepatu({
                kodesepatu: req.body.kodesepatu,
                merksepatu: req.body.merksepatu,
                modelsepatu: req.body.modelsepatu,
                ukuransepatu: req.body.ukuransepatu,
                stok: req.body.stok,
                harga: req.body.harga,
                diskon: req.body.diskon,
            })
            datasepatu.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datasepatu')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datasepatu')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode sepatu sudah ada....')
            res.render('admin/sepatu/input_data', {
                session_store: session_store,
                kodesepatu: req.body.kodesepatu,
                merksepatu: req.body.merksepatu,
                modelsepatu: req.body.modelsepatu,
                ukuransepatu: req.body.ukuransepatu,
                stok: req.body.stok,
                harga: req.body.harga,
                diskon: req.body.diskon,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editsepatu', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Sepatu.findOne({ _id: req.params.id }, function(err, sepatu) {
        if (sepatu) {
            console.log("sepatussss"+sepatu);
            res.render('admin/sepatu/edit_data', { session_store: session_store, sepatus: sepatu })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datasepatu')
        }
    })
})

router.post('/:id/editsepatu', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Sepatu.findById(req.params.id, function(err, sepatu) {
        sepatu.kodesepatu = req.body.kodesepatu;
        sepatu.merksepatu = req.body.merksepatu;
        sepatu.modelsepatu = req.body.modelsepatu;
        sepatu.ukuransepatu = req.body.ukuransepatu;
        sepatu.stok = req.body.stok;
        sepatu.harga = req.body.harga;
        sepatu.diskon = req.body.diskon;

        sepatu.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datasepatu');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Sepatu.findById(req.params.id, function(err, sepatu){
        sepatu.remove(function(err, sepatu){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data sepatu berhasil dihapus!');
            }
            res.redirect('/datasepatu');
        })
    })
})
/* GET users listing. */
router.get('/datapelanggan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Pelanggan.find({}, function(err, pelanggan) {
        //console.log(pelanggan);
        res.render('admin/pelanggan/table', { session_store: session_store, pelanggans: pelanggan })
    }).select('_id kodepelanggan namapelanggan alamat telepon email created_at')
});

/* GET users listing. */
router.get('/inputpelanggan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/pelanggan/input_data', { session_store: session_store})
});

//input data pelanggan
router.post('/inputpelanggan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Pelanggan.find({ kodepelanggan: req.body.kodepelanggan }, function(err, pelanggan) {
        if (pelanggan.length == 0) {
            var datapelanggan = new Pelanggan({
                kodepelanggan: req.body.kodepelanggan,
                namapelanggan: req.body.namapelanggan,
                alamat: req.body.alamat,
                telepon: req.body.telepon,
                email: req.body.email,
            })
            datapelanggan.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datapelanggan')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datapelanggan')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode pelanggan sudah ada....')
            res.render('admin/pelanggan/input_data', {
                session_store: session_store,
                kodepelanggan: req.body.kodepelanggan,
                namapelanggan: req.body.namapelanggan,
                alamat: req.body.alamat,
                telepon: req.body.telepon,
                email: req.body.email,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editpelanggan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Pelanggan.findOne({ _id: req.params.id }, function(err, pelanggan) {
        if (pelanggan) {
            console.log("pelangganssss"+pelanggan);
            res.render('admin/pelanggan/edit_data', { session_store: session_store, pelanggans: pelanggan })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datapelanggan')
        }
    })
})

router.post('/:id/editpelanggan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Pelanggan.findById(req.params.id, function(err, pelanggan) {
        pelanggan.kodepelanggan = req.body.kodepelanggan;
        pelanggan.namapelanggan = req.body.namapelanggan;
        pelanggan.alamat = req.body.alamat;
        pelanggan.telepon = req.body.telepon;
        pelanggan.email = req.body.email;

        pelanggan.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datapelanggan');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Pelanggan.findById(req.params.id, function(err, pelanggan){
        pelanggan.remove(function(err, pelanggan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data pelanggan berhasil dihapus!');
            }
            res.redirect('/datapelanggan');
        })
    })
})
/* GET users listing. */
router.get('/datapenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.find({}, function(err, penjualan) {
        //console.log(penjualan);
        res.render('admin/penjualan/table', { session_store: session_store, penjualans: penjualan })
    }).select('_id nopenjualan kodesepatu tglpenjualan harga jumlah diskon  created_at')
});

/* GET users listing. */
router.get('/inputpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/penjualan/input_data', { session_store: session_store})
});

//input data penjualan
router.post('/inputpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.find({ nopenjualan: req.body.nopenjualan }, function(err, penjualan) {
        if (penjualan.length == 0) {
            var datapenjualan = new Penjualan({
                nopenjualan: req.body.nopenjualan,
                tglpenjualan: req.body.tglpenjualan,
                harga: req.body.harga,
                jumlah: req.body.jumlah,
                diskon: req.body.diskon,
            })
            datapenjualan.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datapenjualan')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datapenjualan')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode penjualan sudah ada....')
            res.render('admin/penjualan/input_data', {
                session_store: session_store,
                nopenjualan: req.body.nopenjualan,
                tglpenjualan: req.body.tglpenjualan,
                harga: req.body.harga,
                jumlah: req.body.jumlah,
                harga: req.body.harga,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.findOne({ _id: req.params.id }, function(err, penjualan) {
        if (penjualan) {
            console.log("penjualanssss"+penjualan);
            res.render('admin/penjualan/edit_data', { session_store: session_store, penjualans: penjualan })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datapenjualan')
        }
    })
})

router.post('/:id/editpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.findById(req.params.id, function(err, penjualan) {
        penjualan.nopenjualan = req.body.nopenjualan;
        penjualan.tglpenjualan = req.body.tglpenjualan;
        penjualan.harga = req.body.harga;
        penjualan.jumlah = req.body.jumlah;
        penjualan.harga = req.body.harga;

        penjualan.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datapenjualan');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Penjualan.findById(req.params.id, function(err, penjualan){
        penjualan.remove(function(err, penjualan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data penjualan berhasil dihapus!');
            }
            res.redirect('/datapenjualan');
        })
    })
})
module.exports = router;