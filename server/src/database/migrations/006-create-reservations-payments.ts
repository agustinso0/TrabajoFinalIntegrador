// Migracion 006: Reservas y pagos de ejemplo
// Algunas transacciones de prueba para el sistema
import Reservation from "../../models/Reservation.js";
import Payment from "../../models/Payment.js";
import RouteInstance from "../../models/RouteInstance.js";
import User from "../../models/User.js";

export const up = async () => {
  console.log("Generando reservas de ejemplo...");

  // Buscar servicios programados y usuarios pasajeros
  const serviciosProgramados = await RouteInstance.find().populate(
    "scheduledRouteId"
  );
  const usuariosPasajeros = await User.find({ role: "passenger" });

  if (serviciosProgramados.length === 0 || usuariosPasajeros.length === 0) {
    console.log(
      "[WARNING] No hay servicios programados o pasajeros - saltando..."
    );
    return;
  }

  // Reservas de ejemplo para testing
  const reservasEjemplo = [
    {
      routeInstanceId: serviciosProgramados[0]._id,
      passengerId: usuariosPasajeros[0]._id,
      seatNumber: 1,
      status: "confirmed",
      paymentMethod: "cash",
      specialRequests: "Asiento junto a la ventana",
      totalAmount: 4200,
    },
    {
      routeInstanceId: serviciosProgramados[0]._id,
      passengerId: usuariosPasajeros[1]._id,
      seatNumber: 2,
      status: "confirmed",
      paymentMethod: "manual",
      specialRequests: "",
      totalAmount: 4200,
    },
    {
      routeInstanceId: serviciosProgramados[1]._id,
      passengerId: usuariosPasajeros[0]._id,
      seatNumber: 5,
      status: "pending",
      paymentMethod: "cash",
      specialRequests: "Necesito factura",
      totalAmount: 8500,
    },
    {
      routeInstanceId: serviciosProgramados[2]._id,
      passengerId: usuariosPasajeros[1]._id,
      seatNumber: 3,
      status: "cancelled",
      paymentMethod: "cash",
      specialRequests: "",
      totalAmount: 2500,
      cancellationReason: "Cambio de planes",
    },
  ];

  const reservasCreadas = [];

  for (const reservationData of reservasEjemplo) {
    const existingReservation = await Reservation.findOne({
      routeInstanceId: reservationData.routeInstanceId,
      passengerId: reservationData.passengerId,
    });

    if (!existingReservation) {
      const reservation = await Reservation.create(reservationData);
      reservasCreadas.push(reservation);
      console.log(
        `[OK] Reserva creada para asiento ${reservationData.seatNumber}`
      );
    } else {
      console.log(
        `[SKIP] Reserva ya existe para asiento ${reservationData.seatNumber}`
      );
      reservasCreadas.push(existingReservation);
    }
  }

  // Crear pagos para reservas confirmadas
  const datosPagos = [
    {
      reservationId: reservasCreadas[0]._id,
      amount: 4200,
      paymentMethod: "cash",
      status: "approved",
      notes: "Pago en efectivo al abordar",
    },
    {
      reservationId: reservasCreadas[1]._id,
      amount: 4200,
      paymentMethod: "manual",
      status: "approved",
      notes: "Pago procesado manualmente",
    },
    {
      reservationId: reservasCreadas[2]._id,
      amount: 8500,
      paymentMethod: "cash",
      status: "pending",
      notes: "Pendiente de pago",
    },
  ];

  for (const paymentData of datosPagos) {
    const existingPayment = await Payment.findOne({
      reservationId: paymentData.reservationId,
    });

    if (!existingPayment) {
      await Payment.create(paymentData);
      console.log(`[OK] Pago creado por $${paymentData.amount}`);
    } else {
      console.log(`[SKIP] Pago ya existe por $${paymentData.amount}`);
    }
  }

  console.log("Reservas y pagos de ejemplo creados correctamente!");
};

export const down = async () => {
  console.log("Rollback: eliminando reservas y pagos...");

  // Eliminar pagos primero (por dependencias)
  await Payment.deleteMany({});

  // Luego eliminar reservas
  await Reservation.deleteMany({});

  console.log("[OK] Reservas y pagos eliminados");
};
