// Migracion 003: Rutas principales del servicio
import ScheduledRoute from "../../models/ScheduledRoute.js";

export const up = async () => {
  console.log("Configurando rutas principales...");

  // Rutas mas populares de TransporteUNI
  const rutasPrincipales = [
    {
      name: "Buenos Aires - Rosario Express",
      origin: {
        address: "Terminal de Omnibus de Retiro, Av. Ramos Mejia 1680",
        city: "Buenos Aires",
        province: "Buenos Aires",
        country: "Argentina",
        coordinates: {
          lat: -34.5906,
          lng: -58.3742,
        },
      },
      destination: {
        address: "Terminal de Omnibus Mariano Moreno",
        city: "Rosario",
        province: "Santa Fe",
        country: "Argentina",
        coordinates: {
          lat: -32.9442,
          lng: -60.6505,
        },
      },
      duration: 240, // aprox 4hs por autopista
      basePrice: 4200,
      description: "Servicio directo por autopista - sin paradas intermedias",
      isActive: true,
    },
    {
      name: "Buenos Aires - Córdoba",
      origin: {
        address: "Terminal de Ómnibus de Retiro",
        city: "Buenos Aires",
        province: "Buenos Aires",
        country: "Argentina",
        coordinates: {
          lat: -34.5906,
          lng: -58.3742,
        },
      },
      destination: {
        address: "Terminal de Ómnibus Córdoba",
        city: "Córdoba",
        province: "Córdoba",
        country: "Argentina",
        coordinates: {
          lat: -31.4135,
          lng: -64.181,
        },
      },
      duration: 480, // 8 horas
      basePrice: 7500,
      description: "Ruta Buenos Aires - Córdoba vía autopista",
      isActive: true,
    },
    {
      name: "Rosario - Santa Fe",
      origin: {
        address: "Terminal de Ómnibus Rosario",
        city: "Rosario",
        province: "Santa Fe",
        country: "Argentina",
        coordinates: {
          lat: -32.9442,
          lng: -60.6505,
        },
      },
      destination: {
        address: "Terminal de Ómnibus Santa Fe",
        city: "Santa Fe",
        province: "Santa Fe",
        country: "Argentina",
        coordinates: {
          lat: -31.6333,
          lng: -60.7,
        },
      },
      duration: 120, // 2 horas
      basePrice: 2200,
      description: "Ruta corta Rosario - Santa Fe",
      isActive: true,
    },
    {
      name: "Buenos Aires - Mar del Plata",
      origin: {
        address: "Terminal de Ómnibus de Retiro",
        city: "Buenos Aires",
        province: "Buenos Aires",
        country: "Argentina",
        coordinates: {
          lat: -34.5906,
          lng: -58.3742,
        },
      },
      destination: {
        address: "Terminal de Ómnibus Mar del Plata",
        city: "Mar del Plata",
        province: "Buenos Aires",
        country: "Argentina",
        coordinates: {
          lat: -38.0023,
          lng: -57.5562,
        },
      },
      duration: 300, // 5 horas
      basePrice: 5200,
      description: "Ruta turística a la costa",
      isActive: true,
    },
    {
      name: "Córdoba - Mendoza",
      origin: {
        address: "Terminal de Ómnibus Córdoba",
        city: "Córdoba",
        province: "Córdoba",
        country: "Argentina",
        coordinates: {
          lat: -31.4135,
          lng: -64.181,
        },
      },
      destination: {
        address: "Terminal del Sol Mendoza",
        city: "Mendoza",
        province: "Mendoza",
        country: "Argentina",
        coordinates: {
          lat: -32.8908,
          lng: -68.8272,
        },
      },
      duration: 360, // 6 horas
      basePrice: 6800,
      description: "Ruta Córdoba - Mendoza",
      isActive: false, // Ruta inactiva para probar filtros
    },
  ];

  // Crear las rutas una por una
  for (const datosRuta of rutasPrincipales) {
    const rutaExiste = await ScheduledRoute.findOne({
      name: datosRuta.name,
    });
    if (!rutaExiste) {
      await ScheduledRoute.create(datosRuta);
      console.log(`[OK] Ruta configurada: ${datosRuta.name}`);
    } else {
      console.log(`[SKIP] Ya existe ruta: ${datosRuta.name}`);
    }
  }

  console.log("Rutas principales del servicio configuradas!");
};

export const down = async () => {
  console.log("Rollback: eliminando rutas principales...");

  const rutasAEliminar = [
    "Buenos Aires - Rosario Express",
    "Buenos Aires - Cordoba",
    "Rosario - Santa Fe",
    "Buenos Aires - Mar del Plata",
    "Cordoba - Mendoza",
  ];

  await ScheduledRoute.deleteMany({ name: { $in: rutasAEliminar } });
  console.log("[OK] Rutas principales eliminadas");
};
