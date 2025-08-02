import type { Request, Response, NextFunction } from "express";

const mockFindUnique = jest.fn();
jest.mock("../../src/config/db", () => ({
  prisma: {
    patient: { findUnique: mockFindUnique }
  }
}));

import { checkPatientExists } from "../../src/middleware/checkPatientExists";

describe("checkPatientExists", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockFindUnique.mockReset();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it("rejects non-integer patientId", async () => {
    req.body = { patientId: "abc" };
    await checkPatientExists(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "patientId must be an integer" });
  });

  it("rejects missing patient", async () => {
    req.body = { patientId: 99 };
    mockFindUnique.mockResolvedValue(null);
    await checkPatientExists(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid patientId" });
  });

  it("calls next() if patient exists", async () => {
    req.body = { patientId: 1 };
    mockFindUnique.mockResolvedValue({ id: 1, name: "X", dob: new Date(), createdAt: new Date() });
    await checkPatientExists(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});