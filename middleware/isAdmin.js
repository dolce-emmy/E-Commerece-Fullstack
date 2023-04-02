

export const isAdmin = async (req, res, next) => {
   if (req.user.role === "admin" || req.params?.id === req.user._id.toString()) {
       next();
   }
    else {
        res.status(403).json({ success: false, data: "You are not authorized to perform this action" });
    }

}