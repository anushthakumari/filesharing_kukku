import React, { useState } from "react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import moment from "moment";
import Select from "react-select";

import MainLayout from "../layouts/Main.Layout";
import { useAuthState } from "../contexts/AuthProvider";

import axios from "../libs/axios.lib";

const FileDetails = () => {
	const { fileId } = useParams();
	const { user } = useAuthState();

	const [toggleLoading, settoggleLoading] = useState(false);
	const [addingUser, setaddingUser] = useState(false);
	const [removingUser, setremovingUser] = useState(false);
	const [selectedUserId, setselectedUserId] = useState();

	const {
		isLoading: isFetching,
		data,
		mutate,
		error,
	} = useSWR("/files/" + fileId, async () => {
		const token = user.token;

		return await axios.get("/files/" + fileId, {
			headers: {
				Authorization: token,
			},
		});
	});

	const fileDetails = data?.data?.fileDetails;
	const usersWithAccess = data?.data?.usersWithAccess;
	const allUsers = data?.data?.allUsers;
	const options = allUsers
		? allUsers.map((v) => ({ value: v.id, label: v.email }))
		: [];

	const handleToggleAccess = async () => {
		try {
			settoggleLoading(true);
			await axios.put(
				"/files/" + fileId + "/access",
				{},
				{
					headers: {
						Authorization: user.token,
					},
				}
			);

			mutate();
		} catch (error) {
			console.log(error);
			alert("something went wrong!");
		} finally {
			settoggleLoading(false);
		}
	};

	const handleSelectChange = (v) => {
		const userId = v.value;
		setselectedUserId(userId);
	};

	const handleUserAdd = async () => {
		try {
			if (!selectedUserId) {
				return;
			}
			setaddingUser(true);

			await axios.post(
				"/files/" + fileId + "/access",
				{ userIds: [selectedUserId], fileId },
				{
					headers: {
						Authorization: user.token,
					},
				}
			);

			mutate();
			setselectedUserId();
			alert("Files access granted to the user!");
		} catch (error) {
			console.log(error);
			alert("Something went wrong while granting access!");
		} finally {
			setaddingUser(false);
		}
	};
	const handleUserRemove = async (userId) => {
		try {
			setremovingUser(true);

			await axios.delete("/files/" + fileId + "/access", {
				params: {
					userId,
				},
				headers: {
					Authorization: user.token,
				},
			});

			mutate();
			alert("Files access revoked for the user!");
		} catch (error) {
			alert("Something went wrong while revoking access!");
		} finally {
			setremovingUser(false);
		}
	};

	let message = "";

	if (error) {
		if (error.response && error.response?.data?.message) {
			message = error.response?.data?.message;
		} else {
			message = "Something went wrong";
		}
	}

	return (
		<MainLayout>
			<div id="displayCont">
				{isFetching ? <div className="text-center">Loading...</div> : null}
				{message ? (
					<div className="text-center text-rose-600">{message}</div>
				) : null}
				{fileDetails ? (
					<div className="m-2 w-100 flex">
						<div className="flex">
							<div style={{ flex: 1 }}>
								<img
									src={
										"https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png"
									}
									alt="Reload page"
									className="opacity"
								/>
								<h6 className="text-3xl capitalize">
									{fileDetails.originalname}
								</h6>
								<a
									className="text-lg text-blue underline"
									href={
										"http://localhost:5000/files/" +
										fileId +
										"/download?token=" +
										user.token
									}
									download={true}>
									Download File
								</a>
								<p className="mt-3 text-sm text-xl">
									Size: {fileDetails.size} bytes
								</p>
								<p className="text-mute text-sm mb-3">
									{moment(fileDetails.created_at).format(
										"MMMM Do YYYY, h:mm:ss a"
									)}
								</p>

								<p className="mt-3 text-lg">
									{fileDetails.public_access
										? "File is Publicly Accessible"
										: "File access is limited"}
								</p>
								<button
									onClick={handleToggleAccess}
									class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
									disabled={toggleLoading}>
									Toggle File Access
								</button>
							</div>
							<div style={{ flex: 1 }}>
								<div>
									<p>Share link:</p>
									<div className="p-2 rounded-md bg-slate-200 flex justify-between">
										<p>http://localhost:3000/files/{fileId}/view</p>
										{/* <button>copy</button> */}
									</div>
								</div>
								<div className="mt-2">
									{fileDetails.public_access ? (
										<p>Anyone with the link can access this file</p>
									) : (
										<div>
											<div className="p-2 rounded-md bg-slate-200 flex justify-between">
												<div style={{ flex: 1 }}>
													<Select
														options={options}
														onChange={handleSelectChange}
													/>
												</div>
												<button
													onClick={handleUserAdd}
													class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-700 rounded"
													disabled={addingUser}>
													{addingUser ? "Adding.. " : "Add User"}
												</button>
											</div>

											<div>
												<p className="my-3 text-xl">
													Users with the file access:{" "}
												</p>
												{usersWithAccess?.map((v) => (
													<div
														key={v.id}
														className="p-2 rounded-md bg-slate-200 flex justify-between">
														{v.email}
														<button
															onClick={handleUserRemove.bind(this, v.id)}
															class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-700 rounded"
															disabled={removingUser}>
															{removingUser ? "removing..." : "Revoke Access"}
														</button>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</MainLayout>
	);
};

export default FileDetails;
