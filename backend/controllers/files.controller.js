const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { pipeline } = require("stream");

const jwtUtils = require("../utils/jwt.utils");
const pool = require("../db");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

const upload = multer({ storage: storage });
const encryptionKey = "ghTYklPNS-#nnf;";

const encryptFile = async (inputPath, outputPath, key) => {
	const input = fs.createReadStream(inputPath);
	const output = fs.createWriteStream(outputPath);
	const cipher = crypto.createCipher("aes-256-cbc", key);

	await new Promise((resolve, reject) => {
		pipeline(input, cipher, output, (err) => {
			if (err) {
				reject(err);
			} else {
				fs.unlinkSync(inputPath);
				resolve();
			}
		});
	});
};

// Function to decrypt a file
const decryptFile = async (inputPath, outputPath, key) => {
	const input = fs.createReadStream(inputPath);
	const output = fs.createWriteStream(outputPath);
	const decipher = crypto.createDecipher("aes-256-cbc", key);

	await new Promise((resolve, reject) => {
		pipeline(input, decipher, output, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

module.exports.uploadFile = [
	upload.single("file"),
	async (req, res) => {
		const fileDetails = req.file;

		const uploadedFilePath = req.file.path;
		const encryptedFilePath = `${uploadedFilePath}.enc`;

		await encryptFile(uploadedFilePath, encryptedFilePath, encryptionKey);

		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			const userId = req.userId;

			await connection.query(
				"INSERT INTO uploaded_files (user_id, fieldname, originalname, encoding, mimetype, destination, filename, path, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[
					userId,
					fileDetails.fieldname,
					fileDetails.originalname,
					fileDetails.encoding,
					fileDetails.mimetype,
					fileDetails.destination,
					fileDetails.filename,
					fileDetails.path,
					fileDetails.size,
				]
			);

			await connection.commit();
			connection.release();

			res.send("File uploaded successfully!");
		} catch (error) {
			console.error("Error saving to database:", error.message);

			// If an error occurs, rollback the transaction and release the connection
			if (connection) {
				await connection.rollback();
				connection.release();
			}

			res.status(500).send("Internal Server Error");
		}
	},
];

module.exports.grantAccessToFileForUsers = async (req, res) => {
	const { userIds, fileId } = req.body;

	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		// Grant access to the file for each user
		for (const userId of userIds) {
			await connection.query(
				"INSERT INTO file_access (user_id, file_id) VALUES (?, ?)",
				[userId, fileId]
			);
		}

		await connection.commit();
		res.send({ message: "access granted" });
	} catch (error) {
		console.error("Error granting access:", error.message);
		await connection.rollback();
	} finally {
		connection.release();
	}
};

module.exports.togglePublicAccess = async (req, res) => {
	const fileId = req.params.fileId;

	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		// Toggle public_access for the file
		const [fileResult] = await connection.query(
			"SELECT * FROM uploaded_files WHERE id = ?",
			[fileId]
		);
		if (fileResult.length === 0) {
			throw new Error(`File with ID ${fileId} not found.`);
		}

		const currentPublicAccess = fileResult[0].public_access;
		const newPublicAccess = !currentPublicAccess;

		await connection.query(
			"UPDATE uploaded_files SET public_access = ? WHERE id = ?",
			[newPublicAccess, fileId]
		);

		await connection.commit();

		res.send({ access: newPublicAccess });
	} catch (error) {
		console.error("Error toggling public access:", error.message);
		await connection.rollback();
	} finally {
		connection.release();
	}
};

module.exports.getFileDetailsAndUsers = async (req, res) => {
	const connection = await pool.getConnection();
	const fileId = req.params.fileId;
	const userId = req.userId;

	try {
		await connection.beginTransaction();

		// Get file details
		const [fileResult] = await connection.query(
			"SELECT * FROM uploaded_files WHERE id = ?",
			[fileId]
		);
		if (fileResult.length === 0) {
			res.status(400).send({ message: `File with ID ${fileId} not found.` });
		}

		const fileDetails = fileResult[0];

		if (fileDetails.user_id !== userId) {
			return res
				.status(400)
				.send({ message: `You dont have access to this file` });
		}

		// Get users with access to the file
		const [usersResult] = await connection.query(
			"SELECT u.id, u.email FROM users u JOIN file_access fa ON u.id = fa.user_id WHERE fa.file_id = ?",
			[fileId]
		);

		await connection.commit();

		const [allUsers] = await connection.query(
			`
      SELECT u.id, u.email
      FROM users u
      WHERE u.id NOT IN (
        SELECT fa.user_id
        FROM file_access fa
        WHERE fa.file_id = ?)
      AND u.id != (
        SELECT uf.user_id
        FROM uploaded_files uf
        WHERE uf.id = ?)`,
			[fileId, fileId]
		);

		res.send({ fileDetails, usersWithAccess: usersResult, allUsers });
	} catch (error) {
		console.error(
			"Error getting file details and users with access:",
			error.message
		);
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};

module.exports.getUploadedFilesByUser = async (req, res) => {
	const connection = await pool.getConnection();
	const userId = req.userId;
	try {
		await connection.beginTransaction();

		const [filesResult] = await connection.query(
			"SELECT * FROM uploaded_files WHERE user_id = ?",
			[userId]
		);

		await connection.commit();

		res.send(filesResult);
	} catch (error) {
		console.error("Error getting uploaded files by user:", error.message);
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};

module.exports.revokeFileAccessForUser = async (req, res) => {
	const fileId = req.params.fileId;
	const { userId } = req.query;

	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		await connection.query(
			"DELETE FROM file_access WHERE file_id = ? AND user_id = ?",
			[fileId, userId]
		);

		await connection.commit();

		res.send({ message: "access revoked!" });
	} catch (error) {
		console.error("Error revoking file access for user:", error.message);
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};

module.exports.getFileForDownload = async (req, res) => {
	const fileId = req.params.fileId;

	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		const [fileResult] = await connection.query(
			"SELECT * FROM uploaded_files WHERE id = ?",
			[fileId]
		);

		await connection.commit();

		if (fileResult.length === 0) {
			throw new Error(`File with ID ${fileId} not found.`);
		}

		const fileDetails = fileResult[0];

		const encryptedFilePath = `uploads/${fileDetails.filename}.enc`;
		const decryptedFilePath = `uploads/${fileDetails.filename}`;

		await decryptFile(encryptedFilePath, decryptedFilePath, encryptionKey);

		res.download(decryptedFilePath, req.params.filename, (err) => {
			if (err) {
				console.error("Error sending file:", err.message);
				res.status(500).send("Internal Server Error");
			}

			//Delete the decrypted file after sending
			fs.unlinkSync(decryptedFilePath);
		});

		// res.attachment(fileDetails.originalname);

		// const filePath = path.join(__dirname, "../uploads", fileDetails.filename);
		// res.sendFile(filePath);
	} catch (error) {
		console.error("Error getting file for download:", error.message);
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};

module.exports.getFileDetails = async (req, res) => {
	const fileId = req.params.fileId;
	const token = req.query.token;

	const userId = jwtUtils.verifyToken(token);
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		const [publicAccessResult] = await connection.query(
			"SELECT * FROM uploaded_files WHERE id = ?",
			[fileId]
		);

		if (
			publicAccessResult[0].user_id === userId ||
			publicAccessResult[0].public_access
		) {
			await connection.commit();
			return res.send(publicAccessResult[0]);
		}

		if (!token) {
			return res.status(401).send({
				// message: "Token missing. Restricted access requires a valid token.",
				message: "You dont have access to the file, try after login",
			});
		}

		// Check if the user has access to the file
		const [accessResult] = await connection.query(
			"SELECT 1 FROM file_access WHERE file_id = ? AND user_id = ?",
			[fileId, userId, token]
		);

		if (accessResult.length === 0) {
			return res.status(401).send({
				message: "You dont have access to the file",
			});
		}

		const [fileResult] = await connection.query(
			"SELECT * FROM uploaded_files WHERE id = ?",
			[fileId]
		);

		await connection.commit();

		if (fileResult.length === 0) {
			return res.status(404).send({
				message: `File not found.`,
			});
		}

		res.send(fileResult[0]);
	} catch (error) {
		console.error("Error getting file details:", error.message);
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};
