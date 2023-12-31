const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { validateCreateReserva } = require('../middlewares/validateCreateReserva');

router.get('/reservas', authenticateJWT ,reservaController.getReservas);
router.get('/reserva/check', authenticateJWT ,reservaController.checkUserReservation)
router.post('/reservas', authenticateJWT, validateCreateReserva, reservaController.createReserva); 
router.put('/reservas/:id', reservaController.updateReserva);
router.delete('/reservas/:id', reservaController.deleteReserva);

module.exports = router;

