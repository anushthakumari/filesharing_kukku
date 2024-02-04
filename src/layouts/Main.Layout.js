import React from "react";

import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const Main = ({ children }) => {
	return (
		<>
			<Navbar />
			<div id="mainCont">
				<SideBar />
				{children}
			</div>
		</>
	);
};

export default Main;
