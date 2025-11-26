
import { NextResponse } from "next/server";
 
export class CommonErrorHandler extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.name = "CommonErrorHandler";
    }
  }
  
export const sendError = (message: string, status: number): NextResponse =>
    NextResponse.json({ error: message }, { status });
