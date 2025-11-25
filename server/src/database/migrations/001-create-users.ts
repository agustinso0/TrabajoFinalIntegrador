// Migracion inicial - usuarios del sistema
// TODO: cambiar contraseñas por defecto en produccion
import User from "../../models/User.js";

export const up = async () => {
  console.log("Insertando usuarios iniciales del sistema...");

  // Usuarios base para el sistema - datos reales para testing
  const usuariosIniciales = [
    {
      email: "admin@transporteuni.com",
      password: "admin123", // cambiar en prod!
      firstName: "Roberto",
      lastName: "Administrador",
      phoneNumber: "+54911555001",
      role: "admin",
    },
    {
      email: "j.perez@transporteuni.com",
      password: "operador456",
      firstName: "Juan",
      lastName: "Perez",
      phoneNumber: "+54911555002",
      role: "operator",
    },
    {
      email: "c.gomez@transporteuni.com",
      password: "chofer789",
      firstName: "Carlos",
      lastName: "Gomez",
      phoneNumber: "+54911555003",
      role: "driver",
    },
    {
      email: "ana.martinez@gmail.com",
      password: "cliente123",
      firstName: "Ana Maria",
      lastName: "Martinez",
      phoneNumber: "+54911555004",
      role: "passenger",
    },
    {
      email: "testuser@gmail.com",
      password: "test123",
      firstName: "Usuario",
      lastName: "De Prueba",
      phoneNumber: "+54911555005",
      role: "passenger",
    },
  ];

  // Crear cada usuario verificando que no exista
  for (const usuarioData of usuariosIniciales) {
    const usuarioExistente = await User.findOne({ email: usuarioData.email });
    if (!usuarioExistente) {
      await User.create(usuarioData);
      console.log(
        `[OK] Creado usuario: ${usuarioData.firstName} ${usuarioData.lastName}`
      );
    } else {
      console.log(`[SKIP] Ya existe: ${usuarioData.email}`);
    }
  }

  console.log("Usuarios del sistema listos!");
};

export const down = async () => {
  console.log("Rollback: eliminando usuarios iniciales...");

  // Lista de emails a eliminar en rollback
  const emailsParaEliminar = [
    "admin@transporteuni.com",
    "j.perez@transporteuni.com",
    "c.gomez@transporteuni.com",
    "ana.martinez@gmail.com",
    "testuser@gmail.com",
  ];

  await User.deleteMany({ email: { $in: emailsParaEliminar } });
  console.log("[OK] Usuarios iniciales eliminados");
};
