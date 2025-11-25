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
      routeInstanceId: routeInstances[0]._id,
      passengerId: passengers[0]._id,
      seatNumber: 1,
      status: "confirmed",
      paymentMethod: "cash",
      specialRequests: "Asiento junto a la ventana",
      totalAmount: 3500,
    },
    {
      routeInstanceId: routeInstances[0]._id,
      passengerId: passengers[1]._id,
      seatNumber: 2,
      status: "confirmed",
      paymentMethod: "manual",
      specialRequests: "",
      totalAmount: 3500,
    },
    {
      routeInstanceId: routeInstances[1]._id,
      passengerId: passengers[0]._id,
      seatNumber: 5,
      status: "pending",
      paymentMethod: "cash",
      specialRequests: "Necesito factura",
      totalAmount: 7500,
    },
    {
      routeInstanceId: routeInstances[2]._id,
      passengerId: passengers[1]._id,
      seatNumber: 3,
      status: "cancelled",
      paymentMethod: "cash",
      specialRequests: "",
      totalAmount: 2200,
      cancellationReason: "Cambio de planes",
    },
  ];

  const createdReservations = [];

  for (const reservationData of reservations) {
    const existingReservation = await Reservation.findOne({
      routeInstanceId: reservationData.routeInstanceId,
      passengerId: reservationData.passengerId,
    });

    if (!existingReservation) {
      const reservation = await Reservation.create(reservationData);
      createdReservations.push(reservation);
      console.log(`Reserva creada para asiento ${reservationData.seatNumber}`);
    } else {
      console.log(
        `Reserva ya existe para asiento ${reservationData.seatNumber}`
      );
      createdReservations.push(existingReservation);
    }
  }

  // Crear pagos para reservas confirmadas
  const paymentsData = [
    {
      reservationId: createdReservations[0]._id,
      amount: 3500,
      paymentMethod: "cash",
      status: "approved",
      notes: "Pago en efectivo al abordar",
    },
    {
      reservationId: createdReservations[1]._id,
      amount: 3500,
      paymentMethod: "manual",
      status: "approved",
      notes: "Pago procesado manualmente",
    },
    {
      reservationId: createdReservations[2]._id,
      amount: 7500,
      paymentMethod: "cash",
      status: "pending",
      notes: "Pendiente de pago",
    },
  ];

  for (const paymentData of paymentsData) {
    const existingPayment = await Payment.findOne({
      reservationId: paymentData.reservationId,
    });

    if (!existingPayment) {
      await Payment.create(paymentData);
      console.log(`Pago creado por $${paymentData.amount}`);
    } else {
      console.log(`Pago ya existe por $${paymentData.amount}`);
    }
  }

  console.log("Reservas y pagos de prueba creados");
};

export const down = async () => {
  console.log("Eliminando reservas y pagos de prueba...");

  // Eliminar todos los pagos de prueba
  await Payment.deleteMany({});

  // Eliminar todas las reservas de prueba
  await Reservation.deleteMany({});

  console.log("Reservas y pagos de prueba eliminados");
};
