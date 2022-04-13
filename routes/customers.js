var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Customer page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM siswa",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("customer/list", {
          title: "Customers",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});


router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var customer = {
        id: req.params.id,
      };

      var delete_sql = "delete from siswa where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          customer,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/customers");
            } else {
              req.flash("msg_info", "Berhasil Menghapus Data!");
              res.redirect("/customers");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM siswa where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/customers");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Customer can't be find!");
              res.redirect("/customers");
            } else {
              console.log(rows);
              res.render("customer/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Harap isi kolom nama!").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_kelas = req.sanitize("kelas").escape().trim();
      v_total_pembayaran = req.sanitize("total_pembayaran").escape().trim();
      v_status_pembayaran = req.sanitize("status_pembayaran").escape();

      var siswa = {
        nama: v_nama,
        kelas: v_kelas,
        total_pembayaran: v_total_pembayaran,
        status_pembayaran: v_status_pembayaran,
      };

      var update_sql = 'update siswa SET ? where id = ' + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          siswa,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("customer/edit", {
                nama: req.param("nama"),
                kelas: req.param("kelas"),
                total_pembayaran: req.param("total_pembayaran"),
                status_pembayaran: req.param("status_pembayaran"),
              });
            } else {
              req.flash('msg_info', 'Berhasil Mengedit Data!');
              res.redirect('/customers/edit/' + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Telah terjadi kesalahan!</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/customer/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Harap isi kolom nama!").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_kelas = req.sanitize("kelas").escape().trim();
    v_total_pembayaran = req.sanitize("total_pembayaran").escape().trim();
    v_status_pembayaran = req.sanitize("status_pembayaran").escape();

    var customer = {
      nama: v_nama,
      kelas: v_kelas,
      total_pembayaran: v_total_pembayaran,
      status_pembayaran: v_status_pembayaran,
    };

    var insert_sql = "INSERT INTO siswa SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        customer,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("customer/add-customer", {
              nama: req.param("nama"),
              kelas: req.param("kelas"),
              total_pembayaran: req.param("total_pembayaran"),
              status_pembayaran: req.param("status_pembayaran"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Berhasil Menambah Data");
            res.redirect("/customers");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Telah terjadi kesalahan!</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("customer/add-customer", {
      nama: req.param("nama"),
      kelas: req.param("kelas"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("customer/add-customer", {
    title: "Add New Customer",
    nama: "",
    kelas: "",
    total_pembayaran: "",
    status_pembayaran: "",
    session_store: req.session,
  });
});

module.exports = router;