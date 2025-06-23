const allowedAdminEmails = process.env.ADMIN_EMAILS?.split(",");

const emailAdminAuth = (req, res, next) => {
    const userEmail = req.user?.email;

    if (!allowedAdminEmails || !allowedAdminEmails.includes(userEmail)) {
        return res.status(403).json({ message: "Admin access denied" });
    }

    next();
};

module.exports = emailAdminAuth;
