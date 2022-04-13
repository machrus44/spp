var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET pegawai page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM pegawai',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('pegawai/list',{title:"pegawai",data:rows,session_store:req.session});
		});
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var pegawai = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from pegawai where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, pegawai, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/pegawai');
				}
				else{
					req.flash('msg_info', 'Delete pegawai Success'); 
					res.redirect('/pegawai');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM pegawai where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/pegawai'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "pegawai can't be find!"); 
					res.redirect('/pegawai');
				}
				else
				{	
					console.log(rows);
					res.render('pegawai/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_hp = req.sanitize( 'hp' ).escape().trim();
		v_kode_pegawai = req.sanitize( 'kode_pegawai' ).escape().trim();

		var pegawai = {
			nama: v_nama,
			alamat: v_alamat,
			hp: v_hp,
			kode_pegawai: v_kode_pegawai
		}

		var update_sql = 'update pegawai SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, pegawai, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('pegawai/edit', 
					{ 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						hp: req.param('hp'),
						kode_pegawai: req.param('kode_pegawai'),
					});
				}else{
					req.flash('msg_info', 'Update pegawai success'); 
					res.redirect('/pegawai');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/pegawai');
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_hp = req.sanitize( 'hp' ).escape().trim();
		v_kode_pegawai = req.sanitize( 'kode_pegawai' ).escape();

		var pegawai = {
			nama: v_nama,
			alamat: v_alamat,
			hp: v_hp,
			kode_pegawai : v_kode_pegawai
		}

		var insert_sql = 'INSERT INTO pegawai SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, pegawai, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('pegawai/add-pegawai', 
					{ 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						hp: req.param('hp'),
						kode_pegawai: req.param('kode_pegawai'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create pegawai success'); 
					res.redirect('/pegawai');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('pegawai/add-pegawai', 
		{ 
			name: req.param('nama'), 
			address: req.param('alamat'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'pegawai/add-pegawai', 
	{ 
		title: 'Add New nama',
		nama: '',
		alamat: '',
		hp:'',
		kode_pegawai:'',
		session_store:req.session
	});
});

module.exports = router;