import { Request, Response, NextFunction } from "express";
import { register } from "../../src/controllers/authController";
import User from "../../src/models/User";
import { generateToken } from "../../src/middlewares/auth";
import { createError, asyncHandler } from "../../src/middlewares/errorHandler";

// Mock dependencias externas
jest.mock("../../src/models/User");
jest.mock("../../src/middlewares/auth");

jest.mock("../../src/middlewares/errorHandler", () => ({
  createError: jest.fn((message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    return error;
  }),
  // asyncHandler mock: ejecuta la funcion del controlador y captura errores
  asyncHandler: (fn) => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next),
}));

describe("authController", () => {
  const mockUserFindOne = User.findOne as jest.Mock;
  const mockUserCreate = User.create as jest.Mock;
  const mockGenerateToken = generateToken as jest.Mock;
  const mockCreateError = createError as jest.Mock;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        role: "passenger",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      mockUserFindOne.mockResolvedValue(null); // Usuario no existente
      mockUserCreate.mockResolvedValue({
        _id: "someUserId",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        role: "passenger",
      });
      mockGenerateToken.mockReturnValue("mockToken");

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserFindOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUserCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          password: "password123",
        })
      );
      expect(mockGenerateToken).toHaveBeenCalledWith("someUserId", "test@example.com");
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Usuario creado exitosamente",
          data: expect.objectContaining({
            token: "mockToken",
            user: expect.objectContaining({
              email: "test@example.com",
            }),
          }),
        })
      );
      expect(mockNext).not.toHaveBeenCalled(); 
    });

    it("should return 409 if email is already in use", async () => {
      mockUserFindOne.mockResolvedValue({ email: "test@example.com" }); // Usuario existente

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserFindOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUserCreate).not.toHaveBeenCalled();
      expect(mockGenerateToken).not.toHaveBeenCalled();
      
      // Se verifica que createError sea llamado con el mensaje y status correcto
      expect(mockCreateError).toHaveBeenCalledWith("El email ya esta en uso", 409);
      
      // mockNext debe ser llamado con el objeto error
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "El email ya esta en uso",
          statusCode: 409,
        })
      );
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});