//tests the auth functions

import { jest } from "@jest/globals";
import { generateToken, authRequired } from "../application/auth.js";
import jwt from "jsonwebtoken";

//set up mock token and sample data
const mockAdmin = {
  id: 1,
  email: "admin@example.com",
  role: "superadmin"
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET;
  process.env.JWT_EXPIRES_IN;
});

//tests generate Token function and returns the correct user details and token details
test("creates a valid JWT with correct payload", () => {
  const signMock = jest.spyOn(jwt, "sign").mockReturnValue("mocked.jwt.token");

  const token = generateToken(mockAdmin);

  expect(signMock).toHaveBeenCalledWith({
    id: 1,
    email: "admin@example.com",
    role: "superadmin",
  },
  expect.any(String), { expiresIn: process.env.JWT_EXPIRES_IN });

  expect(token).toBe("mocked.jwt.token");
});

//tests the correct 401 error is raised within authRequired function
test("returns 401 error if Authorization header doesn't start with Bearer", () => {

  const req = { headers: { authorization: "Token 123" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  authRequired(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({error: "Missing or invalid Authorization header"});
  expect(next).not.toHaveBeenCalled();
});

//testing that 401 error occurs (invalid token) in authRequired function
test("returns 401 if token is invalid", () => {
  const req = { headers: { authorization: "Bearer invalidtoken" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const next = jest.fn();

  const verifyMock = jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

  authRequired(req, res, next);

  expect(verifyMock).toHaveBeenCalledWith("invalidtoken",expect.any(String));
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({error: "Invalid or expired token"});
  expect(next).not.toHaveBeenCalled();
});

//correctly returns the user details when the correct auth info is given
test("calls next() and attaches user to req when token is valid", () => {

  const req = { headers: { authorization: "Bearer validtoken" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const next = jest.fn();

  const mockPayload = { id: 1, email: "admin@example.com", role: "superadmin" };
  
  const verifyMock = jest.spyOn(jwt, "verify").mockReturnValue(mockPayload);

  authRequired(req, res, next);

  expect(verifyMock).toHaveBeenCalledWith("validtoken",expect.any(String));
  expect(req.user).toEqual(mockPayload);
  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});

