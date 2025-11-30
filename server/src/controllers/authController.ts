import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, ApiResponse } from "../types/index";
import User from "../models/User";
import { generateToken } from "../middlewares/auth";
import { createError, asyncHandler } from "../middlewares/errorHandler";

// constantes de mensajes y roles
const DEFAULT_USER_ROLE = "passenger";
const MSG_EMAIL_IN_USE = "El email ya esta en uso";
const MSG_USER_CREATED = "Usuario creado exitosamente";
const MSG_LOGIN_SUCCESS = "Inicio de sesion exitoso";
const MSG_INVALID_CREDENTIALS = "Email o contraseña incorrectos";
const MSG_MISSING_CREDENTIALS = "Email y contraseña son requeridos";
const MSG_NOT_AUTHENTICATED = "No estas autenticado";
const MSG_USER_NOT_FOUND = "Usuario no encontrado";
const MSG_PROFILE_RETRIEVED = "Perfil obtenido correctamente";
const MSG_PROFILE_UPDATED = "Perfil actualizado correctamente";

// crear usuario nuevo
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;

  // verificar si ya existe el mail
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(MSG_EMAIL_IN_USE, 409);
  }

  // crear usuario nuevo
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role: role || DEFAULT_USER_ROLE,
  });

  const token = generateToken(user._id!.toString(), user.email);

  const response: ApiResponse = {
    success: true,
    message: MSG_USER_CREATED,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
    },
  };

  res.status(201).json(response);
});

// hacer login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError(MSG_MISSING_CREDENTIALS, 400);
  }

  // buscar usuario activo
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw createError(MSG_INVALID_CREDENTIALS, 401);
  }

  const token = generateToken(user._id!.toString(), user.email);

  const response: ApiResponse = {
    success: true,
    message: MSG_LOGIN_SUCCESS,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
    },
  };

  res.json(response);
});

// obtener datos del perfil
export const getProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError(MSG_NOT_AUTHENTICATED, 401);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw createError(MSG_USER_NOT_FOUND, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: MSG_PROFILE_RETRIEVED,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };

    res.json(response);
  }
);

// actualizar info del perfil
export const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError("No estas logueado", 401);
    }

    const { firstName, lastName, phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw createError("Usuario no encontrado", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Perfil actualizado",
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          updatedAt: user.updatedAt,
        },
      },
    };

    res.json(response);
  }
);

// cambiar contraseña
export const changePassword = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError("No estas logueado", 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createError("Falta password actual o nuevo", 400);
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      throw createError("Usuario no encontrado", 404);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw createError("Password actual incorrecto", 400);
    }

    user.password = newPassword;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: "Password cambiado",
    };

    res.json(response);
  }
);

// renovar el token
export const refreshToken = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError("No estas logueado", 401);
    }

    const token = generateToken(req.user._id!.toString(), req.user.email);

    const response: ApiResponse = {
      success: true,
      message: "Token renovado",
      data: { token },
    };

    res.json(response);
  }
);
