// declare global

import { JwtPayloadExt } from "../../middleware/auth/auth.middleware";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadExt;
        }
    }
}