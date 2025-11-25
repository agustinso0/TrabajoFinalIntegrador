import { Request, Response } from "express";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import Reservation from "../models/Reservation.js";
import RouteInstance from "../models/RouteInstance.js";
import Payment from "../models/Payment.js";
import { createError, asyncHandler } from "../middlewares/errorHandler.js";

// crear nueva reserva
export const createReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError("Usuario no autenticado", 401);
    }

    const {
      routeInstanceId,
      paymentMethod,
      specialRequests,
      pickupLocation,
      dropoffLocation,
    } = req.body;

    if (!routeInstanceId || !paymentMethod) {
      throw createError("ID de ruta y metodo de pago son requeridos", 400);
    }

    // validar que existe la ruta
    const routeInstance = await RouteInstance.findById(routeInstanceId)
      .populate("scheduledRouteId")
      .populate("vehicleId");

    if (!routeInstance) {
      throw createError("Instancia de ruta no encontrada", 404);
    }

    if (routeInstance.status !== "scheduled") {
      throw createError("Esta ruta no esta disponible para reservas", 400);
    }

    if (routeInstance.availableSeats <= 0) {
      throw createError("No hay asientos disponibles", 400);
    }

    // ver si ya tiene reserva
    const existingReservation = await Reservation.findOne({
      routeInstanceId,
      passengerId: req.user._id,
      status: { $ne: "cancelled" },
    });

    if (existingReservation) {
      throw createError("Ya tienes una reserva para esta ruta", 409);
    }

    // crear la reserva nueva
    const newReservation = await Reservation.create({
      routeInstanceId,
      passengerId: req.user._id,
      totalAmount: routeInstance.currentPrice,
      paymentMethod,
      specialRequests,
      pickupLocation,
      dropoffLocation,
    });

    // traer todos los datos para mostrar
    const populatedReservation = await Reservation.findById(newReservation._id)
      .populate({
        path: "routeInstanceId",
        populate: {
          path: "scheduledRouteId vehicleId driverId",
          select:
            "name origin destination duration licensePlate brand model capacity firstName lastName",
        },
      })
      .populate("passengerId", "firstName lastName email phoneNumber");

    const response: ApiResponse = {
      success: true,
      message: "Reserva creada",
      data: populatedReservation,
    };

    res.status(201).json(response);
  }
);

// obtener reservas del usuario logueado
export const getUserReservations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError("Usuario no autenticado", 401);
    }

    const { status, page = 1, limit = 10 } = req.query;

    const filter: any = { passengerId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .populate({
          path: "routeInstanceId",
          populate: {
            path: "scheduledRouteId vehicleId driverId",
            select:
              "name origin destination duration licensePlate brand model capacity firstName lastName",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Reservation.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response: ApiResponse = {
      success: true,
      message: "Reservas obtenidas exitosamente",
      data: reservations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };

    res.json(response);
  }
);

// ver una reserva especifica
export const getReservationById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate({
        path: "routeInstanceId",
        populate: {
          path: "scheduledRouteId vehicleId driverId",
          select:
            "name origin destination duration licensePlate brand model capacity firstName lastName phoneNumber",
        },
      })
      .populate("passengerId", "firstName lastName email phoneNumber");

    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // verificar que puede ver esta reserva
    const isOwner =
      reservation.passengerId.toString() === req.user?._id?.toString();
    const isAuthorized =
      req.user?.role === "admin" || req.user?.role === "operator" || isOwner;

    if (!isAuthorized) {
      throw createError("No tienes permisos para ver esta reserva", 403);
    }

    // buscar pago asociado
    const payment = await Payment.findOne({ reservationId: id });

    const response: ApiResponse = {
      success: true,
      message: "Reserva obtenida exitosamente",
      data: {
        ...reservation.toObject(),
        payment,
      },
    };

    res.json(response);
  }
);

// cancelar una reserva
export const cancelReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const reservation = await Reservation.findById(id).populate(
      "routeInstanceId"
    );

    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // Verificar permisos
    const isOwner =
      reservation.passengerId.toString() === req.user?._id?.toString();
    const isAuthorized =
      req.user?.role === "admin" || req.user?.role === "operator" || isOwner;

    if (!isAuthorized) {
      throw createError("No tienes permisos para cancelar esta reserva", 403);
    }

    // ver si se puede cancelar
    if (reservation.status === "cancelled") {
      throw createError("La reserva ya está cancelada", 400);
    }

    if (reservation.status === "completed") {
      throw createError("No se puede cancelar una reserva completada", 400);
    }

    // chequear tiempo limite (solo para pasajeros)
    // los admins pueden cancelar siempre
    const routeInstance = reservation.routeInstanceId as any;
    if (routeInstance) {
      const departureDateTime = new Date(routeInstance.departureDate);
      const [hours, minutes] = routeInstance.departureTime.split(":");
      departureDateTime.setHours(parseInt(hours), parseInt(minutes));

      const twoHoursBefore = new Date(
        departureDateTime.getTime() - 2 * 60 * 60 * 1000
      );

      if (new Date() >= twoHoursBefore && req.user?.role === "passenger") {
        throw createError(
          "No se puede cancelar con menos de 2 horas de anticipación",
          400
        );
      }
    }

    // marcar como cancelada
    reservation.status = "cancelled";
    await reservation.save();

    // cancelar pago si estaba pago
    if (reservation.paymentStatus === "paid") {
      await Payment.findOneAndUpdate(
        { reservationId: id, status: "approved" },
        { status: "cancelled" }
      );
      reservation.paymentStatus = "pending";
      await reservation.save();
    }

    const response: ApiResponse = {
      success: true,
      message: "Reserva cancelada exitosamente",
      data: reservation,
    };

    res.json(response);
  }
);

// editar reserva
export const updateReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { specialRequests, pickupLocation, dropoffLocation } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // Verificar permisos
    const isOwner =
      reservation.passengerId.toString() === req.user?._id?.toString();
    const isAuthorized =
      req.user?.role === "admin" || req.user?.role === "operator" || isOwner;

    if (!isAuthorized) {
      throw createError("No tienes permisos para modificar esta reserva", 403);
    }

    // Solo permitir cambios en reservas activas
    if (!["pending", "confirmed"].includes(reservation.status)) {
      throw createError(
        "Solo se pueden modificar reservas pendientes o confirmadas",
        400
      );
    }

    // cambiar lo que se puede cambiar
    const { notes } = req.body;

    if (notes !== undefined) {
      (reservation as any).notes = notes;
    }

    await reservation.save();

    const updatedReservation = await Reservation.findById(id)
      .populate({
        path: "routeInstanceId",
        populate: {
          path: "scheduledRouteId vehicleId driverId",
          select:
            "name origin destination duration licensePlate brand model capacity firstName lastName",
        },
      })
      .populate("passengerId", "firstName lastName email phoneNumber");

    const response: ApiResponse = {
      success: true,
      message: "Reserva actualizada exitosamente",
      data: updatedReservation,
    };

    res.json(response);
  }
);

// ver todas las reservas (admin)
export const getAllReservations = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      status,
      paymentStatus,
      routeInstanceId,
      passengerId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (routeInstanceId) filter.routeInstanceId = routeInstanceId;
    if (passengerId) filter.passengerId = passengerId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .populate({
          path: "routeInstanceId",
          populate: {
            path: "scheduledRouteId vehicleId driverId",
            select:
              "name origin destination duration licensePlate brand model firstName lastName",
          },
        })
        .populate("passengerId", "firstName lastName email phoneNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Reservation.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response: ApiResponse = {
      success: true,
      message: "Reservas obtenidas exitosamente",
      data: reservations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };

    res.json(response);
  }
);
