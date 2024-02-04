import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";

import Navbar from "../components/Navbar";

import axios from "../libs/axios.lib";
import { useAuthState } from "../contexts/AuthProvider";

const FileView = () => {
	const { fileId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuthState();

	const {
		isLoading: isFetching,
		data,
		error,
	} = useSWR("/files/" + fileId, async () => {
		const token = user?.token;

		return await axios.get("/files/" + fileId + "/view", {
			params: {
				token,
			},
		});
	});

	const fileDetails = data?.data;

	let message = "";

	if (error) {
		if (error.response && error.response?.data?.message) {
			message = error.response?.data?.message;
		} else {
			message = "Something went wrong";
		}
	}

	return (
		<div>
			<Navbar />
			{isFetching ? <div className="text-center">Loading...</div> : null}
			{message ? (
				<div className="text-center text-rose-600">{message}</div>
			) : null}
			{fileDetails ? (
				<div>
					<div className="flex">
						<img
							src={
								"https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png"
							}
							alt="Reload page"
							className="opacity"
						/>
						<div className="mt-10">
							<h6 className="text-3xl capitalize">
								{fileDetails.originalname}
							</h6>
							<a
								className="text-lg text-blue underline"
								href={
									"http://localhost:5000/files/" +
									fileId +
									"/download?token=" +
									user?.token
								}
								download={true}>
								Download File
							</a>
							<p className="mt-3 text-sm text-xl">
								Size: {fileDetails.size} bytes
							</p>

							<p className="mt-3 text-lg">
								{fileDetails.public_access
									? "File is Publicly Accessible"
									: "File access is limited"}
							</p>
						</div>
					</div>
				</div>
			) : (
				<center>
					<button
						onClick={() => {
							navigate("/");
						}}
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-700 rounded">
						{user ? "Go to Home" : "Login"}
					</button>
				</center>
			)}
		</div>
	);
};

export default FileView;
