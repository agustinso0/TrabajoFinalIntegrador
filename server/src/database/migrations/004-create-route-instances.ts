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
      scheduledRouteId: routes[0]._id, // Buenos Aires - Rosario
      vehicleId: vehicles[1]._id,
      driverId: drivers[0]._id,
      departureDate: dayAfterTomorrow,
      departureTime: "08:00",
      arrivalTime: "12:00",
      availableSeats: 15,
      status: "scheduled",
      price: 3500,
    },
    {
      scheduledRouteId: routes[1]._id, // Buenos Aires - Cordoba
      vehicleId: vehicles[2]._id,
      driverId: drivers[0]._id,
      departureDate: tomorrow,
      departureTime: "22:00",
      arrivalTime: "06:00",
      availableSeats: 18,
      status: "scheduled",
      price: 7500,
    },
    {
      scheduledRouteId: routes[2]._id, // Rosario - Santa Fe
      vehicleId: vehicles[0]._id,
      driverId: drivers[0]._id,
      departureDate: tomorrow,
      departureTime: "15:30",
      arrivalTime: "17:30",
      availableSeats: 20,
      status: "scheduled",
      price: 2200,
    },
    {
      scheduledRouteId: routes[3]._id, // Buenos Aires - Mar del Plata
      vehicleId: vehicles[1]._id,
      driverId: drivers[0]._id,
      departureDate: dayAfterTomorrow,
      departureTime: "09:00",
      arrivalTime: "14:00",
      availableSeats: 15,
      status: "scheduled",
      price: 5200,
    },
  ];

  for (const instanceData of routeInstances) {
    const existingInstance = await RouteInstance.findOne({
      scheduledRouteId: instanceData.scheduledRouteId,
      departureDate: instanceData.departureDate,
      departureTime: instanceData.departureTime,
    });

    if (!existingInstance) {
      await RouteInstance.create(instanceData);
      console.log(
        `Instancia de ruta creada para ${instanceData.departureDate.toDateString()}`
      );
    } else {
      console.log(
        `Instancia ya existe para ${instanceData.departureDate.toDateString()}`
      );
    }
  }

  console.log("Instancias de rutas de prueba creadas");
};

export const down = async () => {
  console.log("Eliminando instancias de rutas de prueba...");

  // Eliminar instancias de los proximos 3 dias
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 3);

  await RouteInstance.deleteMany({
    departureDate: { $gte: today, $lte: futureDate },
  });

  console.log("Instancias de rutas de prueba eliminadas");
};
