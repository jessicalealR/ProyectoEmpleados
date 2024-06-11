const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
    code: String,
    nombre: String,
    apellido: String,
    cargo: String,
    salario: Number,
    fecha_contratacion: Date
});

module.exports = mongoose.model('Empleado', EmpleadoSchema);
