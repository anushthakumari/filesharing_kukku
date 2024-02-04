import React from "react";
import "../css/DisplayContainer.css";

export default function DisplayCard({ title }) {
	return (
		<div className="displayCard">
			<img
				src={
					"https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png"
				}
				alt="Reload page"
				className="opacity"
			/>
			<h6>{title}</h6>
		</div>
	);
}
