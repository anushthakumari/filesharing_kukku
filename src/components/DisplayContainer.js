import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSwr from "swr";
import moment from "moment";

import list_view from "../pics/list_view.jpg";
import info from "../pics/info.png";
import "../css/DisplayContainer.css";
import DisplayCard from "./DisplayCard";

import axios from "../libs/axios.lib";

import { useAuthState } from "../contexts/AuthProvider";

export default function DisplayContainer() {
	const [isLoading, setisLoading] = useState(false);
	const { user } = useAuthState();

	const {
		isLoading: isFetching,
		data,
		mutate,
	} = useSwr("/files", async () => {
		const token = user.token;

		return await axios.get("/files", {
			headers: {
				Authorization: token,
			},
		});
	});

	const handleChange = async (e) => {
		try {
			setisLoading(true);

			const fd = new FormData();

			fd.append("file", e.target.files[0]);

			const d = await axios.post("/files/upload", fd, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: user.token,
				},
			});

			mutate();
		} catch (error) {
			if (e.response && e.response?.data?.message) {
				alert(e.response?.data?.message);
			} else {
				alert("Something went wrong while uploading the file");
			}
		} finally {
			setisLoading(false);
		}
	};

	return (
		<>
			<div id="displayCont">
				<div className="flex items-center">
					<h2 style={{ margin: "20px" }}>Your Files</h2>
					<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
						<input
							id="file-btn"
							type="file"
							hidden
							onChange={handleChange}
							disabled={isLoading}
						/>
						<label for="file-btn">
							{isLoading ? "uploading.." : "Upload A File"}
						</label>
					</button>
				</div>

				{isFetching ? <div className="text-center">Loading...</div> : null}
				{!data?.data?.length ? (
					<div className="text-center">You dont have any files</div>
				) : null}

				<div className="flex gap-2">
					{data?.data?.map((v) => (
						<Link
							to={"/files/" + v.id + "/details"}
							style={{
								height: "auto",
								maxWidth: "280px",
								cursor: "pointer",
							}}
							key={v.id}>
							<div className="displayCard">
								<img
									src={
										"https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png"
									}
									alt="Reload page"
									className="opacity"
								/>
							</div>
							<h6 className="text-lg capitalize">{v.originalname}</h6>
							<span className="text-mute text-sm">
								{moment(v.created_at).format("MMMM Do YYYY, h:mm:ss a")}
							</span>
							<p className="mt-3 text-sm">
								{v.public_access ? "Public Access" : "Restricted Access"}
							</p>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
