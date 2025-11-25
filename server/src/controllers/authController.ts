import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import User from "../models/User.js";
import { generateToken } from "../middlewares/auth.js";
import { createError, asyncHandler } from "../middlewares/errorHandler.js";

// Constantes de mensajes
const MESSAGES = {
  USER_CREATED: "Usuario creado",
  USER_EXISTS: "El email ya esta en uso",
  LOGIN_SUCCESS: "Login ok",
  INVALID_CREDENTIALS: "Email o password incorrecto",
  MISSING_CREDENTIALS: "Falta email o password",
  NOT_AUTHENTICATED: "No estas logueado",
  USER_NOT_FOUND: "Usuario no encontrado",
  PROFILE_FOUND: "Perfil encontrado",
  PROFILE_UPDATED: "Perfil actualizado",
  PASSWORD_CHANGED: "Password cambiado",
  INVALID_CURRENT_PASSWORD: "Password actual incorrecto",
  MISSING_PASSWORD_DATA: "Falta password actual o nuevo",
  TOKEN_REFRESHED: "Token renovado",
} as const;

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const;

// crear usuario nuevo
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;

  // verificar si ya existe el mail
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(MESSAGES.USER_EXISTS, HTTP_STATUS.CONFLICT);
  }

  // crear usuario nuevo
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role: role || "passenger",
  });

  const token = generateToken(user._id!.toString(), user.email);

  const response: ApiResponse = {
    success: true,
    message: MESSAGES.USER_CREATED,
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
    throw createError(MESSAGES.MISSING_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  // buscar usuario activo
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw createError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const token = generateToken(user._id!.toString(), user.email);

  const response: ApiResponse = {
    success: true,
    message: MESSAGES.LOGIN_SUCCESS,
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
      throw createError(MESSAGES.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw createError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.PROFILE_FOUND,
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
      throw createError(MESSAGES.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    }

    const { firstName, lastName, phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw createError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.PROFILE_UPDATED,
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
      throw createError(MESSAGES.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createError(MESSAGES.MISSING_PASSWORD_DATA, HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      throw createError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw createError(MESSAGES.INVALID_CURRENT_PASSWORD, HTTP_STATUS.BAD_REQUEST);
    }

    user.password = newPassword;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.PASSWORD_CHANGED,
    };

    res.json(response);
  }
);

// renovar el token
export const refreshToken = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError(MESSAGES.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = generateToken(req.user._id!.toString(), req.user.email);

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.TOKEN_REFRESHED,
      data: { token },
    };

    res.json(response);
  }
);
