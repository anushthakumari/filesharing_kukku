const jwt = require("jsonwebtoken");

const secret = "67JHKNJfjfY787@#$";

const jwtUtils = {
	signToken: (userId) => {
		return jwt.sign({ userId }, secret, { expiresIn: "2d" });
	},
	verifyToken: (token) => {
		return jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				return null;
			}
			return decoded.userId;
		});
	},
};

module.exports = jwtUtils;
