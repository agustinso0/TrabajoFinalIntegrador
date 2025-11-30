// Migracion 002: Flota inicial de vehiculos
import Vehicle from "../../models/Vehicle.js";

export const up = async () => {
  console.log("Cargando flota de vehiculos...");

  const flotaVehiculos = [
    {
      licensePlate: "AB123CD",
      brand: "Mercedes-Benz",
      vehicleModel: "Sprinter 516",
      capacity: 20,
      year: 2020,
      features: [
        "Aire acondicionado",
        "WiFi gratis",
        "Cinturones 3 puntos",
        "Baño",
      ],
      isActive: true,
    },
    {
      licensePlate: "EF456GH",
      brand: "Iveco",
      vehicleModel: "Daily Minibus",
      capacity: 15,
      year: 2019,
      features: ["A/A", "GPS", "Radio AM/FM"],
      isActive: true,
    },
    {
      licensePlate: "IJ789KL",
      brand: "Volkswagen",
      vehicleModel: "Crafter",
      capacity: 18,
      year: 2021,
      features: [
        "Aire acondicionado",
        "WiFi",
        "Cargadores USB",
        "Cinturones de seguridad",
        "Luces de lectura",
      ],
      isActive: true,
    },
    {
      licensePlate: "MN012OP",
      brand: "Mercedes-Benz",
      vehicleModel: "Sprinter 519",
      capacity: 25,
      year: 2018,
      features: ["Aire acondicionado", "WiFi"],
      isActive: false, // esta en el taller
    },
  ];

  // Insertar cada vehiculo si no existe ya
  for (const datosVehiculo of flotaVehiculos) {
    const vehiculoExiste = await Vehicle.findOne({
      licensePlate: datosVehiculo.licensePlate,
    });
    if (!vehiculoExiste) {
      await Vehicle.create(datosVehiculo);
      console.log(
        `[OK] Registrado vehiculo: ${datosVehiculo.licensePlate} (${datosVehiculo.vehicleModel})`
      );
    } else {
      console.log(`[SKIP] Ya registrado: ${datosVehiculo.licensePlate}`);
    }
  }

  console.log("Flota de vehiculos cargada correctamente!");
};

export const down = async () => {
  console.log("Rollback: eliminando flota de vehiculos...");

  const patentesAEliminar = ["AB123CD", "EF456GH", "IJ789KL", "MN012OP"];
  await Vehicle.deleteMany({ licensePlate: { $in: patentesAEliminar } });
  console.log("[OK] Vehiculos eliminados de la base");
};
