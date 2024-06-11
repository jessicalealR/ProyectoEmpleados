const express = require('express');
const router = express.Router();
const Empleado = require('../models/empleado');

/**
 * @swagger
 * tags:
 *   name: Empleados
 *   description: API para gestionar empleados
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Empleado:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         puesto:
 *           type: string
 *         departamento:
 *           type: string
 *         salario:
 *           type: number
 *         fecha_contratacion:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /empleados:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Empleados]
 *     responses:
 *       '200':
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empleado'
 */
router.get('/', async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.json(empleados);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /empleados:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       '201':
 *         description: Empleado creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       '400':
 *         description: Error al crear el empleado
 */
router.post('/', async (req, res) => {
    const empleado = new Empleado(req.body);
    try {
        const nuevoEmpleado = await empleado.save();
        res.status(201).json(nuevoEmpleado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /empleados/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       '404':
 *         description: Empleado no encontrado
 *       '500':
 *         description: Error al obtener el empleado
 */
router.get('/:id', getEmpleado, (req, res) => {
    res.json(res.empleado);
});

/**
 * @swagger
 * /empleados/{id}:
 *   put:
 *     summary: Actualizar un empleado por ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       '200':
 *         description: Empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       '400':
 *         description: Error al actualizar el empleado
 *       '500':
 *         description: Error interno del servidor
 */
router.put('/:id', getEmpleado, async (req, res) => {
    Object.assign(res.empleado, req.body);
    try {
        const empleadoActualizado = await res.empleado.save();
        res.json(empleadoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /empleados/{id}:
 *   delete:
 *     summary: Eliminar un empleado por ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Empleado eliminado
 *       '500':
 *         description: Error al eliminar el empleado
 */
router.delete('/:id', getEmpleado, async (req, res) => {
    try {
        await res.empleado.remove();
        res.json({ message: 'Empleado eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware para obtener empleado por ID
async function getEmpleado(req, res, next) {
    let empleado;
    try {
        empleado = await Empleado.findById(req.params.id);
        if (empleado == null) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.empleado = empleado;
    next();
}

module.exports = router;
