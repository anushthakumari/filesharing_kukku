const express = require("express");
const cors = require("cors");

const router = require("./router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", router);

const port = 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
