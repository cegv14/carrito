var express = require('express');
var router = express.Router();
var sql = require('../conexion')
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template');
});




//Creamos una ruta POST
router.post('/crear_orden', function(req, res, next) {
  //Simulamos una orden
  var orden = {producto:'Calabacin', monto:0.1};

  //Creamos el sql
  var stmt = `INSERT INTO public.ordenes(
    monto, productos, pagado,usuario_id)
    VALUES (`+orden.monto+`, '`+JSON.stringify(orden)+`', false, 1) RETURNING id;`;
  
  //Insertamos en la base de datos
  sql.query(stmt, async (err, result) => {
    if(err){
      console.log(err)
    }
    //OBTENEMOS LINK DE LA API
    var options = {
      'method': 'POST',
      'url': 'https://bank.fookel.com/api/create_link',
      'headers': {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1LCJub21icmUiOiJQcm9ncmFtYSBjb25taWdvIiwiZW1haWwiOiJwZ19jb25taWdvQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDE2ODM1NzV9.aJC0GxcR7z0_2Su7IYhhUHdZiLsRGSTg2PT2AoqYxnk',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'nu_operation': result.rows[0].id,
        'price': orden.monto
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      //IMPRIMIMOS EL RESULTADO
      console.log(response.body);
    });

      res.redirect('/');
  });
});


router.post('/webhook', function(req, res, next) {
  console.log(req.body.completed)
  
  //ACTUALIZAR DATOS DE LA BASE DE DATOS
  var sql = `UPDATE public.ordenes
	SET pagado=`+req.body.completed+`, referencia='`+req.body.nu_referencia+`'
	WHERE id=`+req.body.nu_operation;
  sql.query(stmt, async (err, result) => {
    if(err){
      console.log(err)
    }
    if(req.body.completed){
      console.log("GRACIAS POR SU COMPRA.")
    }
  });
  
  //RETORNAR RESPUESTA
  res.json({"result":true})
});
module.exports = router;
