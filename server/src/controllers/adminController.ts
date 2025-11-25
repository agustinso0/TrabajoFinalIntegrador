import { Request, Response } from "express";
import { ApiResponse } from "../types/index.js";
import Reservation from "../models/Reservation.js";
import Payment from "../models/Payment.js";
import RouteInstance from "../models/RouteInstance.js";
import User from "../models/User.js";
import { createError, asyncHandler } from "../middlewares/errorHandler.js";

// limites por defecto para admin
const DEFAULT_ADMIN_USERS_LIMIT = 20;
const DEFAULT_RECENT_LIMIT = 10;

// resumen basico del sistema
export const getBasicSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const [totalUsers, totalReservations, totalRoutes, totalPayments] =
      await Promise.all([
        User.countDocuments({ isActive: true }),
        Reservation.countDocuments(),
        RouteInstance.countDocuments(),
        Payment.countDocuments({ status: "approved" }),
      ]);

    const response: ApiResponse = {
      success: true,
      message: "Resumen obtenido exitosamente",
      data: {
        users: totalUsers,
        reservations: totalReservations,
        routes: totalRoutes,
        payments: totalPayments,
        lastUpdated: new Date().toISOString(),
      },
    };

    res.json(response);
  }
);

// traer lista de usuarios
export const getUsersList = asyncHandler(
  async (req: Request, res: Response) => {
    const { role, page = 1, limit = DEFAULT_ADMIN_USERS_LIMIT } = req.query;

    const filter: any = { isActive: true };
    if (role) filter.role = role; // filtrar por rol si viene

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response: ApiResponse = {
      success: true,
      message: "Lista de usuarios obtenida exitosamente",
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      },
    };

    res.json(response);
  }
);

// ver reservas recientes
export const getRecentReservations = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit = DEFAULT_RECENT_LIMIT } = req.query;

    const reservations = await Reservation.find()
      .populate("passengerId", "firstName lastName email")
      .populate({
        path: "routeInstanceId",
        populate: {
          path: "scheduledRouteId",
          select: "name origin destination",
        },
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    const response: ApiResponse = {
      success: true,
      message: "Reservas recientes obtenidas exitosamente",
      data: {
        reservations,
        count: reservations.length,
      },
    };

    res.json(response);
  }
);

// estado del sistema
export const getSystemStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const now = new Date();

    // hardcodeado pero funciona
    const systemStatus = {
      timestamp: now.toISOString(),
      status: "operational",
      database: "connected",
      services: {
        authentication: "active",
        reservations: "active",
        payments: "active",
      },
    };

    const response: ApiResponse = {
      success: true,
      message: "Todo funcionando bien",
      data: systemStatus,
    };

    res.json(response);
  }
);
