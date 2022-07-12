import { verifyAccessJwt } from "../../helpers/jwtHelper.js";
import { getAdmin } from "../../models/admin/Admin.models.js";
import { deleteSession, getSession } from "../../models/session/sessionModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const decoded = verifyAccessJwt(authorization);
      if(decoded==='jwt expired'){
        
       return res.status(403).json({
            status: "error",
            message: "jwt expired!",
          });
      }
      if (decoded?.email) {
        const existInDb = await getSession({ type: "jwt", token: authorization });
        if (existInDb?._id) {
          const admin = await getAdmin({ email: decoded.email });
          if (admin?._id) {
            req.adminInfo = admin;
            return next();
          }
        }
      }
    }
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    next(error);
  }
};
