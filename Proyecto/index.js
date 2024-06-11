const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.use('/docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))
app.use('/',require('./routes/empleados.js'))

// Conexión a MongoDB
mongoose.connect('mongodb+srv://jessicaleal01:KcqSNKFyZlWgwA2z@empleados.sfc5re2.mongodb.net/?retryWrites=true&w=majority&appName=Empleados', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


// Ruta para la página principal
app.get('/', (req, res) => {
  res.render('index', { warningMessage: null });
});

// Ruta para agregar un nuevo empleado
app.post('/empleados', (req, res) => {
  const fechaContratacion = new Date(req.body.fecha_contratacion);
  const hoy = new Date();

  if (fechaContratacion > hoy) {
    // Fecha no válida, asignar mensaje de advertencia
    const warningMessage = "La fecha de contratación no puede ser mayor a la fecha de hoy.";
    res.render('index', { warningMessage: warningMessage });
  } else {
    const nuevoEmpleado = new Empleado({
      nombre: req.body.nombre,
      puesto: req.body.puesto,
      departamento: req.body.departamento,
      salario: parseInt(req.body.salario),
      fecha_contratacion: fechaContratacion
    });

    nuevoEmpleado.save((err) => {
      if (err) {
        console.log('Error saving empleado:', err);
        res.redirect('/');
      } else {
        console.log('Empleado agregado correctamente');
        res.redirect('/empleados');
      }
    });
  }
});

// Ruta para ver todos los empleados
app.get('/empleados', (req, res) => {
  Empleado.find({}, (err, empleados) => {
    if (err) {
      console.log('Error fetching empleados:', err);
    } else {
      res.render('empleados', { empleados: empleados, moment: moment });
    }
  });
});

// Ruta para mostrar el formulario de edición de empleado
app.get('/empleados/edit/:id', (req, res) => {
  const empleadoId = req.params.id;
  Empleado.findById(empleadoId, (err, empleado) => {
    if (err) {
      console.log('Error fetching empleado:', err);
    } else {
      res.render('edit', { empleado: empleado, warningMessage: null });
    }
  });
});

// Ruta para actualizar un empleado
app.post('/empleados/update/:id', (req, res) => {
  const empleadoId = req.params.id;
  const updatedEmpleado = {
    nombre: req.body.nombre,
    puesto: req.body.puesto,
    departamento: req.body.departamento,
    salario: parseInt(req.body.salario),
    fecha_contratacion: new Date(req.body.fecha_contratacion)
  };

  Empleado.findByIdAndUpdate(empleadoId, updatedEmpleado, (err) => {
    if (err) {
      console.log('Error updating empleado:', err);
    } else {
      console.log('Empleado actualizado correctamente');
      res.redirect('/empleados');
    }
  });
});

// Ruta para eliminar un empleado
app.post('/empleados/delete/:id', (req, res) => {
  const empleadoId = req.params.id;
  Empleado.findByIdAndRemove(empleadoId, (err) => {
    if (err) {
      console.log('Error deleting empleado:', err);
    } else {
      console.log('Empleado eliminado correctamente');
      res.redirect('/empleados');
    }
  });
});

// Ruta para la documentación de Swagger
app.get('/api-docs', (req, res) => {
  res.send(swaggerDocs);
});

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
