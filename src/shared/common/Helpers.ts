import { NextResponse } from 'next/server';
export default class ResponseBuilder {
    static success(message: string, status: number = 200, data: any = null) {
        return ApiResponse.apiResponse(true ,message, status, data);
    }
    static failure(message: string, status:number, data: any = null) {
        return ApiResponse.apiResponse(false ,message, status, data);
    }
}

class ApiResponse {
  static apiResponse(success: boolean, message: string, status: number = 200, data: any = null) {
    return NextResponse.json(
      {
        success: success,
        statusCode: status,
        message: message,
        data: data
      }
    );  
  }
}
