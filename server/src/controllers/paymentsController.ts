import { Request, Response } from "express";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import Payment from "../models/Payment.js";
import Reservation from "../models/Reservation.js";
import { createError, asyncHandler } from "../middlewares/errorHandler.js";

// constantes de estados y métodos de pago
const ALLOWED_PAYMENT_METHODS = ["cash", "manual"];
const PAYMENT_STATUS_APPROVED = "approved";
const PAYMENT_STATUS_REJECTED = "rejected";
const PAYMENT_STATUS_CANCELLED = "cancelled";
const PAYMENT_STATUS_PENDING = "pending";
const UPDATABLE_PAYMENT_STATUSES = [
  PAYMENT_STATUS_APPROVED,
  PAYMENT_STATUS_REJECTED,
  PAYMENT_STATUS_CANCELLED,
];

// crear pago manual
export const createManualPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError("Usuario no autenticado", 401);
    }

    const { reservationId, paymentMethod, notes } = req.body;

    if (!reservationId) {
      throw createError("ID de reserva requerido", 400);
    }

    if (!paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      throw createError(
        `Metodo de pago invalido. Debe ser: ${ALLOWED_PAYMENT_METHODS.join(
          " o "
        )}`,
        400
      );
    }

    // ver que existe la reserva
    const reservation = await Reservation.findById(reservationId)
      .populate("routeInstanceId")
      .populate("passengerId");

    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // chequear permisos basicos
    if (
      req.user.role === "passenger" &&
      reservation.passengerId.toString() !== req.user._id?.toString()
    ) {
      throw createError(
        "No tienes permisos para crear un pago para esta reserva",
        403
      );
    }

    if (reservation.paymentStatus === "paid") {
      throw createError("Esta reserva ya está pagada", 400);
    }

    if (reservation.status === "cancelled") {
      throw createError("No se puede pagar una reserva cancelada", 400);
    }

    // verificar que no haya otro pago
    const existingPayment = await Payment.findOne({
      reservationId,
      status: { $in: ["pending", "approved"] },
    });

    if (existingPayment) {
      throw createError("Ya existe un pago para esta reserva", 400);
    }

    // crear el pago
    const payment = new Payment({
      reservationId,
      paymentMethod,
      amount: reservation.totalAmount,
      currency: "ARS",
      status:
        paymentMethod === "cash"
          ? PAYMENT_STATUS_PENDING
          : PAYMENT_STATUS_PENDING,
      notes,
      processedBy: req.user.role !== "passenger" ? req.user._id : undefined,
    });

    await payment.save();

    const response: ApiResponse<typeof payment> = {
      success: true,
      message: "Pago creado",
      data: payment,
    };

    res.status(201).json(response);
  }
);

// ver pagos de una reserva
export const getPaymentsByReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { reservationId } = req.params;

    if (!reservationId) {
      throw createError("ID de reserva requerido", 400);
    }

    // verificar que existe y tiene permisos
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // solo puede ver sus propios pagos
    if (
      req.user?.role === "passenger" &&
      reservation.passengerId.toString() !== req.user._id?.toString()
    ) {
      throw createError(
        "No tienes permisos para ver los pagos de esta reserva",
        403
      );
    }

    const payments = await Payment.find({ reservationId })
      .populate("processedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    const response: ApiResponse<typeof payments> = {
      success: true,
      message: "Pagos obtenidos exitosamente",
      data: payments,
    };

    res.json(response);
  }
);

// cambiar estado de un pago (solo admins)
export const updatePaymentStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !["admin", "operator"].includes(req.user.role)) {
      throw createError("No tienes permisos para realizar esta acción", 403);
    }

    const { paymentId } = req.params;
    const { status, notes } = req.body;

    if (!UPDATABLE_PAYMENT_STATUSES.includes(status)) {
      throw createError(
        `Estado de pago inválido. Debe ser: ${UPDATABLE_PAYMENT_STATUSES.join(
          ", "
        )}`,
        400
      );
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw createError("Pago no encontrado", 404);
    }

    if (payment.status !== PAYMENT_STATUS_PENDING) {
      throw createError("Solo se pueden modificar pagos pendientes", 400);
    }

    payment.status = status;
    payment.processedBy = req.user._id;
    payment.processedAt = new Date();
    if (notes) payment.notes = notes;

    await payment.save();

    const response: ApiResponse<typeof payment> = {
      success: true,
      message: `Pago ${
        status === "approved"
          ? "aprobado"
          : status === "rejected"
          ? "rechazado"
          : "cancelado"
      } exitosamente`,
      data: payment,
    };

    res.json(response);
  }
);

// historial de pagos con filtros
export const getPaymentHistory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !["admin", "operator"].includes(req.user.role)) {
      throw createError("No tienes permisos para realizar esta acción", 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status, paymentMethod, dateFrom, dateTo } = req.query;

    // armar filtros de busqueda
    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (paymentMethod) {
      filters.paymentMethod = paymentMethod;
    }

    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) {
        filters.createdAt.$gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        filters.createdAt.$lte = new Date(dateTo as string);
      }
    }

    const [payments, total] = await Promise.all([
      Payment.find(filters)
        .populate("reservationId", "totalAmount")
        .populate("processedBy", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(filters),
    ]);

    const response: ApiResponse<{
      payments: typeof payments;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }> = {
      success: true,
      message: "Historial de pagos obtenido exitosamente",
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    };

    res.json(response);
  }
);

// estadisticas de pagos
export const getPaymentStatistics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !["admin", "operator"].includes(req.user.role)) {
      throw createError("No tienes permisos para realizar esta acción", 403);
    }

    const { dateFrom, dateTo } = req.query;

    const filters: any = {};
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) {
        filters.createdAt.$gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        filters.createdAt.$lte = new Date(dateTo as string);
      }
    }

    const stats = await Payment.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          approvedPayments: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          rejectedPayments: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          cashPayments: {
            $sum: { $cond: [{ $eq: ["$paymentMethod", "cash"] }, 1, 0] },
          },
          manualPayments: {
            $sum: { $cond: [{ $eq: ["$paymentMethod", "manual"] }, 1, 0] },
          },
        },
      },
    ]);

    const statistics = stats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      approvedPayments: 0,
      pendingPayments: 0,
      rejectedPayments: 0,
      cashPayments: 0,
      manualPayments: 0,
    };

    const response: ApiResponse<typeof statistics> = {
      success: true,
      message: "Estadísticas de pagos obtenidas exitosamente",
      data: statistics,
    };

    res.json(response);
  }
);
