const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../db");
const jwtUtils = require("../utils/jwt.utils");

const clientID =
	"448774381681-da8vhof2bai3j18mjpceb7jc0hvmfm1u.apps.googleusercontent.com";

const client = new OAuth2Client(clientID);

module.exports.register = async (req, res) => {
	try {
		const { fname, lname, email, password } = req.body;

		if (!email || !password || password.length < 6) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const salt = await bcrypt.genSalt(10);

		// Hash the password with the salt
		const hashedPassword = await bcrypt.hash(password, salt);

		// Connect to the database
		const connection = await pool.getConnection();

		try {
			// Check for existing user
			const [rows] = await connection.query(
				"SELECT * FROM users WHERE email = ?",
				[email]
			);
			if (rows.length > 0) {
				return res.status(409).json({ message: "Email already exists" });
			}

			// Insert new user
			await connection.query(
				"INSERT INTO users (first_name, last_name, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)",
				[fname, lname, email, hashedPassword, salt]
			);

			res.status(201).json({ message: "User registered successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Registration failed" });
		} finally {
			connection.release();
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Registration failed" });
	}
};

module.exports.login = async (req, res) => {
	try {
		const { email, password, token } = req.body;

		const connection = await pool.getConnection();

		if (token) {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: clientID,
			});

			const payload = ticket.getPayload();

			const email = payload.email;
			const first_name = payload.given_name;
			const last_name = payload.family_name;

			const [rows] = await connection.query(
				"SELECT * FROM users WHERE email = ?",
				[email]
			);
			const user = rows[0];

			//register user
			if (!user) {
				// Insert data
				const [inserted_row] = await connection.query(
					"INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)",
					[first_name, last_name || first_name, email]
				);

				// Get last inserted ID
				const [lastInsertRow] = await connection.query(
					"SELECT LAST_INSERT_ID() as lastId"
				);

				const lastInsertId = lastInsertRow[0].lastId;

				const token = jwtUtils.signToken(lastInsertId);

				res.json({ token });
			} else {
				const token = jwtUtils.signToken(user.id);

				res.json({ token });
			}

			return;
		}

		// Validate user input (example)
		if (!email || !password) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		try {
			// Find user by email
			const [rows] = await connection.query(
				"SELECT * FROM users WHERE email = ?",
				[email]
			);
			const user = rows[0];

			if (!user) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			// Compare password with hashed password
			const passwordMatch = await bcrypt.compare(password, user.password_hash);
			if (!passwordMatch) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			// Generate JWT token
			const token = jwtUtils.signToken(user.id);

			res.json({ token });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Login failed" });
		} finally {
			connection.release();
		}
	} catch (error) {
		console.error(error);
	}
};
