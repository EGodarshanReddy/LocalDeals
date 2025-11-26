import { HTTP_METHODS } from "../constants/common";
import { ROLES } from "../constants/Roles";
import { API_PATHS } from "./ApiPaths";


export const API_PATH_PERMISSION: Record<string, any>={

    [HTTP_METHODS.GET]:{
        // Public/Common APIs
        [API_PATHS.CATEGORIES]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.USER_TYPES]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],

        // Consumer APIs
        [API_PATHS.CONSUMER_DEALS]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.CONSUMER_DEAL_BY_ID]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.CONSUMER_STORES]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.CONSUMER_STORE_BY_ID]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.CONSUMER_NOTIFICATIONS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_NOTIFICATION_BY_ID]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_REDEMPTIONS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_REWARDS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_REFERRALS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_VISITS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],

        // Partner APIs
        [API_PATHS.PARTNER_STORE]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_DEALS]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_DEAL_BY_ID]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_REDEMPTIONS]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_REVIEWS]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_VISITS]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_ANALYTICS]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
    },

    [HTTP_METHODS.POST]:{
        // Auth APIs
        [API_PATHS.LOGOUT]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.SET_PASSWORD]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],
        [API_PATHS.REFRESH_TOKEN]:[
            ROLES.ADMIN,
            ROLES.BUYER,
            ROLES.SELLER,
            ROLES.VISITOR
        ],

        // Consumer APIs
        [API_PATHS.CONSUMER_REDEEM]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_REFERRALS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_REVIEWS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_VISITS]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_VISIT_COMPLETE]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],

        // Partner APIs
        [API_PATHS.PARTNER_DEALS]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_DEAL_DEACTIVATE]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_VISIT_COMPLETE]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],

        // Note: LOGIN and SEND_OTP are public (in PUBLIC_PATHS)
        // and don't require authentication, so they don't need permissions here
    },

    [HTTP_METHODS.PATCH]:{
        // Consumer APIs
        [API_PATHS.CONSUMER_PROFILE]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],
        [API_PATHS.CONSUMER_NOTIFICATION_BY_ID]:[
            ROLES.ADMIN,
            ROLES.BUYER
        ],

        // Partner APIs
        [API_PATHS.PARTNER_STORE]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
        [API_PATHS.PARTNER_DEAL_BY_ID]:[
            ROLES.ADMIN,
            ROLES.SELLER
        ],
    },

    [HTTP_METHODS.DELETE]:{
        // Add DELETE permissions here when routes are implemented
    }
    
}