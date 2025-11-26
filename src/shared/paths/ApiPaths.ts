
export enum API_PATHS {
    // AUTH PATHS
    LOGIN = "/api/auth/login",
    LOGOUT = "/api/auth/logout",
    SEND_OTP = "/api/auth/send-otp",
    VERIFY_OTP = "/api/auth/verify-otp",
    SET_PASSWORD = "/api/auth/setPassword",
    REFRESH_TOKEN = "/api/auth/refreshTocken",
    CATEGORIES = "/api/categories",
    // CONSUMER PATHS
    CONSUMER_DEALS = "/api/consumer/deals",
    CONSUMER_DEAL_BY_ID = "/api/consumer/deals/:id",

    CONSUMER_NOTIFICATIONS = "/api/consumer/notifications",
    CONSUMER_NOTIFICATION_BY_ID = "/api/consumer/notifications/:id",

    CONSUMER_PROFILE = "/api/consumer/profile/:id",

    CONSUMER_REDEEM = "/api/consumer/redeem",
    CONSUMER_REDEMPTIONS = "/api/consumer/redemptions",

    CONSUMER_REFERRALS = "/api/consumer/referrals",
    CONSUMER_REVIEWS = "/api/consumer/reviews",
    CONSUMER_REWARDS = "/api/consumer/rewards",

    CONSUMER_STORES = "/api/consumer/stores",
    CONSUMER_STORE_BY_ID = "/api/consumer/stores/:id",

    CONSUMER_VISITS = "/api/consumer/visits",
    CONSUMER_VISIT_COMPLETE = "/api/consumer/visits/:id/complete",

    // PARTNER PATHS
    PARTNER_ANALYTICS = "/api/partner/analytics",

    PARTNER_DEALS = "/api/partner/deals",
    PARTNER_DEAL_BY_ID = "/api/partner/deals/:id",
    PARTNER_DEAL_DEACTIVATE = "/api/partner/deals/:id/deactivate",

    PARTNER_REDEMPTIONS = "/api/partner/redemptions",
    PARTNER_REVIEWS = "/api/partner/reviews",

    PARTNER_STORE = "/api/partner/store",

    PARTNER_VISITS = "/api/partner/visits",
    PARTNER_VISIT_COMPLETE = "/api/partner/visits/:id/complete",

// USER TYPE PATH
    USER_TYPES = "/api/user-types",


}


// Public endpoints that do NOT need JWT
export const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
  "/api/categories",
  "/api/openapi",
  "/swagger",
];
export const PUBLIC_DYNAMIC = [
  "/api/consumer/deals/:id",
  "/api/consumer/stores/:id"
];
