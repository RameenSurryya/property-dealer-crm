import { NextResponse } from "next/server";

export function validateRequiredFields(body, requiredFields = []) {
  const missingFields = requiredFields.filter((field) => {
    return body[field] === undefined || body[field] === null || body[field] === "";
  });

  if (missingFields.length > 0) {
    return {
      isValid: false,
      response: NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      ),
    };
  }

  return { isValid: true };
}

export function validateLeadData(body) {
  const requiredCheck = validateRequiredFields(body, [
    "name",
    "phone",
    "propertyInterest",
    "budget",
  ]);

  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  if (Number(body.budget) <= 0) {
    return {
      isValid: false,
      response: NextResponse.json(
        { message: "Budget must be greater than 0" },
        { status: 400 }
      ),
    };
  }

  return { isValid: true };
}