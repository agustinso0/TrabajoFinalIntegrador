import { Request, Response } from "express";
import { createError, asyncHandler } from "../middlewares/errorHandler.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import RouteInstance from "../models/RouteInstance.js";
import ScheduledRoute from "../models/ScheduledRoute.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// constantes de paginacion
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// buscar rutas disponibles
export const getAvailableRoutes = asyncHandler(
  async (req: Request, res: Response) => {
    const { date, origin, destination, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

    if (!date) {
      throw createError("La fecha es requerida", 400);
    }

    const searchDate = new Date(date as string);
    if (isNaN(searchDate.getTime())) {
      throw createError("Formato de fecha invalido", 400);
    }

    // armar filtro basico
    const filter: any = {
      departureDate: {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999)),
      },
      status: "scheduled",
      availableSeats: { $gt: 0 },
    };

    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: "scheduledroutes",
          localField: "scheduledRouteId",
          foreignField: "_id",
          as: "route",
        },
      },
      { $unwind: "$route" },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      { $unwind: "$vehicle" },
      {
        $lookup: {
          from: "users",
          localField: "driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" },
    ];

    if (origin || destination) {
      const routeFilter: any = {};

      if (origin) {
        routeFilter["route.origin.city"] = {
          $regex: origin as string,
          $options: "i",
        };
      }

      if (destination) {
        routeFilter["route.destination.city"] = {
          $regex: destination as string,
          $options: "i",
        };
      }

      pipeline.push({ $match: routeFilter });
    }

    pipeline.push({
      $project: {
        _id: 1,
        departureDate: 1,
        departureTime: 1,
        arrivalTime: 1,
        currentPrice: 1,
        availableSeats: 1,
        status: 1,
        notes: 1,
        route: {
          _id: "$route._id",
          name: "$route.name",
          origin: "$route.origin",
          destination: "$route.destination",
          description: "$route.description",
          duration: "$route.duration",
        },
        vehicle: {
          _id: "$vehicle._id",
          licensePlate: "$vehicle.licensePlate",
          brand: "$vehicle.brand",
          model: "$vehicle.model",
          capacity: "$vehicle.capacity",
          features: "$vehicle.features",
        },
        driver: {
          _id: "$driver._id",
          firstName: "$driver.firstName",
          lastName: "$driver.lastName",
        },
      },
    });

    // Paginación
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [routeInstances, total] = await Promise.all([
      RouteInstance.aggregate([
        ...pipeline,
        { $sort: { departureTime: 1, currentPrice: 1 } },
        { $skip: skip },
        { $limit: limitNum },
      ]),
      RouteInstance.aggregate([...pipeline, { $count: "total" }]),
    ]);

    const totalCount = total[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    const response: ApiResponse = {
      success: true,
      message: "Rutas disponibles obtenidas exitosamente",
      data: routeInstances,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
    };

    res.json(response);
  }
);

// ver una ruta por ID
export const getRouteById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const routeInstance = await RouteInstance.findById(id)
      .populate("scheduledRouteId")
      .populate("vehicleId")
      .populate("driverId", "firstName lastName phoneNumber");

    if (!routeInstance) {
      throw createError("Ruta no encontrada", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Ruta obtenida exitosamente",
      data: routeInstance,
    };

    res.json(response);
  }
);

// buscar rutas con filtros
export const searchRoutes = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      origin,
      destination,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      minSeats,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
    } = req.query;

    const filter: any = { status: "scheduled" };

    // filtrar por fechas si vienen
    if (startDate || endDate) {
      filter.departureDate = {};
      if (startDate) {
        filter.departureDate.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.departureDate.$lte = new Date(endDate as string);
      }
    }

    // filtrar por precio si viene
    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) {
        filter.currentPrice.$gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        filter.currentPrice.$lte = parseFloat(maxPrice as string);
      }
    }

    // filtrar por asientos
    if (minSeats) {
      filter.availableSeats = { $gte: parseInt(minSeats as string) };
    }

    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: "scheduledroutes",
          localField: "scheduledRouteId",
          foreignField: "_id",
          as: "route",
        },
      },
      { $unwind: "$route" },
    ];

    // Filtrar por origen y destino
    if (origin || destination) {
      const routeFilter: any = {};

      if (origin) {
        routeFilter["route.origin.city"] = {
          $regex: origin as string,
          $options: "i",
        };
      }

      if (destination) {
        routeFilter["route.destination.city"] = {
          $regex: destination as string,
          $options: "i",
        };
      }

      pipeline.push({ $match: routeFilter });
    }

    // Agregar lookup para vehículo y conductor
    pipeline.push(
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      { $unwind: "$vehicle" },
      {
        $lookup: {
          from: "users",
          localField: "driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" }
    );

    // Paginación
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [routes, total] = await Promise.all([
      RouteInstance.aggregate([
        ...pipeline,
        { $sort: { departureDate: 1, departureTime: 1 } },
        { $skip: skip },
        { $limit: limitNum },
      ]),
      RouteInstance.aggregate([...pipeline, { $count: "total" }]),
    ]);

    const totalCount = total[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    const response: ApiResponse = {
      success: true,
      message: "Busqueda de rutas completada",
      data: routes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
    };

    res.json(response);
  }
);

// rutas mas populares
export const getPopularRoutes = asyncHandler(
  async (req: Request, res: Response) => {
    const DEFAULT_POPULAR_LIMIT = 5;
    const { limit = DEFAULT_POPULAR_LIMIT } = req.query;

    const popularRoutes = await RouteInstance.aggregate([
      {
        $match: {
          departureDate: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          }, // ultimos 30 dias
          status: { $in: ["completed", "in-progress"] },
        },
      },
      {
        $lookup: {
          from: "scheduledroutes",
          localField: "scheduledRouteId",
          foreignField: "_id",
          as: "route",
        },
      },
      { $unwind: "$route" },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      { $unwind: "$vehicle" },
      {
        $group: {
          _id: "$scheduledRouteId",
          routeName: { $first: "$route.name" },
          origin: { $first: "$route.origin" },
          destination: { $first: "$route.destination" },
          totalTrips: { $sum: 1 },
          totalPassengers: {
            $sum: { $subtract: ["$vehicle.capacity", "$availableSeats"] },
          },
          averagePrice: { $avg: "$currentPrice" },
          lastTrip: { $max: "$departureDate" },
        },
      },
      { $sort: { totalTrips: -1, totalPassengers: -1 } },
      { $limit: parseInt(limit as string) },
      {
        $project: {
          _id: 1,
          routeName: 1,
          origin: 1,
          destination: 1,
          totalTrips: 1,
          totalPassengers: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          lastTrip: 1,
        },
      },
    ]);

    const response: ApiResponse = {
      success: true,
      message: "Rutas populares obtenidas exitosamente",
      data: popularRoutes,
    };

    res.json(response);
  }
);
