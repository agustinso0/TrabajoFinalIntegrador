// Migracion 004: Horarios de la semana proxima
// Configurar servicios para los proximos dias
import RouteInstance from "../../models/RouteInstance.js";
import ScheduledRoute from "../../models/ScheduledRoute.js";
import Vehicle from "../../models/Vehicle.js";
import User from "../../models/User.js";

export const up = async () => {
  console.log("Programando servicios de la semana...");

  // Buscar datos necesarios en la BD
  const rutasDisponibles = await ScheduledRoute.find();
  const vehiculosActivos = await Vehicle.find({ isActive: true });
  const choferes = await User.find({ role: "driver" });

  if (
    rutasDisponibles.length === 0 ||
    vehiculosActivos.length === 0 ||
    choferes.length === 0
  ) {
    console.log(
      "[WARNING] Faltan datos base (rutas/vehiculos/choferes) - saltando..."
    );
    return;
  }

  // Calcular fechas para programar servicios
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const pasadoManana = new Date(hoy);
  pasadoManana.setDate(hoy.getDate() + 2);

  const serviciosProgramados = [
    {
      scheduledRouteId: rutasDisponibles[0]._id, // primera ruta (BS AS - Rosario)
      vehicleId: vehiculosActivos[0]._id,
      driverId: choferes[0]._id,
      departureDate: manana,
      departureTime: "08:30", // salida manana
      arrivalTime: "12:30",
      availableSeats: 20,
      status: "scheduled",
      price: 4200,
    },
    {
      scheduledRouteId: rutasDisponibles[0]._id,
      vehicleId: vehiculosActivos[1]._id,
      driverId: choferes[0]._id,
      departureDate: pasadoManana,
      departureTime: "14:00",
      arrivalTime: "18:00",
      availableSeats: 15,
      status: "scheduled",
      price: 4200,
    },
    {
      scheduledRouteId: rutasDisponibles[1]._id,
      vehicleId: vehiculosActivos[2]._id,
      driverId: choferes[0]._id,
      departureDate: manana,
      departureTime: "22:00",
      arrivalTime: "06:00",
      availableSeats: 18,
      status: "scheduled",
      price: 8500,
    },
    {
      scheduledRouteId: rutasDisponibles[2]._id,
      vehicleId: vehiculosActivos[0]._id,
      driverId: choferes[0]._id,
      departureDate: manana,
      departureTime: "15:30",
      arrivalTime: "17:30",
      availableSeats: 20,
      status: "scheduled",
      price: 2500,
    },
    {
      scheduledRouteId: rutasDisponibles[3]._id,
      vehicleId: vehiculosActivos[1]._id,
      driverId: choferes[0]._id,
      departureDate: pasadoManana,
      departureTime: "09:00",
      arrivalTime: "14:00",
      availableSeats: 15,
      status: "scheduled",
      price: 5800,
    },
  ];

  for (const instanceData of serviciosProgramados) {
    const existingInstance = await RouteInstance.findOne({
      scheduledRouteId: instanceData.scheduledRouteId,
      departureDate: instanceData.departureDate,
      departureTime: instanceData.departureTime,
    });

    if (!existingInstance) {
      await RouteInstance.create(instanceData);
      console.log(
        `[OK] Servicio programado para ${instanceData.departureDate.toDateString()}`
      );
    } else {
      console.log(
        `[SKIP] Servicio ya existe para ${instanceData.departureDate.toDateString()}`
      );
    }
  }

  console.log("Servicios de la semana programados correctamente!");
};

export const down = async () => {
  console.log("Rollback: eliminando servicios programados...");

  // Eliminar servicios de los proximos 3 dias
  const hoy = new Date();
  const fechaLimite = new Date(hoy);
  fechaLimite.setDate(hoy.getDate() + 3);

  await RouteInstance.deleteMany({
    departureDate: { $gte: hoy, $lte: fechaLimite },
  });

  console.log("[OK] Servicios programados eliminados");
};
