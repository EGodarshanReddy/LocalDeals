
export enum HTTP_METHODS{
    GET="GET",
    POST="POST",
    PUT="PUT",
    PATCH="PATCH",
    DELETE="DELETE"
}

export enum AppConstants{
    BADREUEST="Bad Request",
    UNAUTHORIZED="Unauthorized",
    FORBIDDEN="Forbidden",
    NOTFOUND="Not Found",
    INTERNALSERVERERROR="Internal Server Error"
}
export const StatusCode={
    OK:200,
    CREATED:201,
    BADREQUEST:400,
    UNAUTHORIZED:401,
    FORBIDDEN:403,
    NOTFOUND:404,
    INTERNALSERVERERROR:500
}

const TOKEN_EXPIRATION="1d";

export {TOKEN_EXPIRATION}
const REFRESH_TOKEN_EXPIRATION="7d";

export {REFRESH_TOKEN_EXPIRATION}