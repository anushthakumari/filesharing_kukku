const express = require("express");

const {
	uploadFile,
	getFileDetailsAndUsers,
	togglePublicAccess,
	getUploadedFilesByUser,
	grantAccessToFileForUsers,
	revokeFileAccessForUser,
	getFileForDownload,
	getFileDetails,
} = require("../controllers/files.controller");

const auth = require("../utils/auth.utils");

const router = express.Router();

router.route("/upload").post(auth, uploadFile);
router.route("/:fileId/download").get(getFileForDownload);
router.route("/:fileId/view").get(getFileDetails);
router
	.route("/:fileId/access")
	.put(auth, togglePublicAccess)
	.post(auth, grantAccessToFileForUsers)
	.delete(auth, revokeFileAccessForUser);

router.route("/:fileId").get(auth, getFileDetailsAndUsers);
router.route("/").get(auth, getUploadedFilesByUser);

module.exports = router;
