import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "../css/SideBar.css";

import { useAuthState } from "../contexts/AuthProvider";

export default function SideBar() {
	const { saveUser } = useAuthState();
	const navigate = useNavigate();

	const handleLogout = () => {
		saveUser(null);
		navigate("/");
	};

	return (
		<>
			<div id="sideBar">
				<div id="sideBarOpt">
					<div className="sideBarOptions">
						{/* <img src={drive} alt="Reload page" className="opacity" /> */}
						<Link to="/">
							<h3>My Files</h3>
						</Link>
					</div>

					{/* <div className="sideBarOptions">
						<img src={computers} alt="Reload page" className="opacity" />
						<h3>Computers</h3>
					</div>

					<div className="sideBarOptions">
						<img src={shared} alt="Reload page" className="opacity" />
						<h3>Shared with me</h3>
					</div>

					<div className="sideBarOptions">
						<img src={recent} alt="Reload page" className="opacity" />
						<h3>Recent</h3>
					</div>

					<div className="sideBarOptions activeSideOpt">
						<img src={starred} alt="Reload page" className="opacity" />
						<h3>Starred</h3>
					</div>

					<div className="sideBarOptions">
						<img src={trash} alt="Reload page" className="opacity" />
						<h3>Trash</h3>
					</div> */}
				</div>

				<div id="storageInfo">
					<button onClick={handleLogout} id="buyStorage">
						Log Out
					</button>
				</div>
			</div>
		</>
	);
}
