const jwtUtils = require("./jwt.utils");

const authMiddleware = (req, res, next) => {
	const token = req.headers.authorization || req.query.token;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const userId = jwtUtils.verifyToken(token);

	try {
		req.userId = userId;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token" });
	}
};

module.exports = authMiddleware;
