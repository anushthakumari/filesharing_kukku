import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "../libs/axios.lib";

const Register = () => {
	const [isLoading, setisLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const body = {};
		formData.forEach(function (value, key) {
			body[key] = value;
		});

		if (body.cpass !== body.password) {
			alert("passwords do not match!");
			return;
		}

		setisLoading(true);
		axios
			.post("/users", body)
			.then((r) => {
				alert("Registered successfully!");
				navigate("/login");
			})
			.catch((e) => {
				if (e.response && e.response?.data?.message) {
					alert(e.response?.data?.message);
				} else {
					alert("Something went wrong");
				}
			})
			.finally(() => {
				setisLoading(false);
			});
	};

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<center>
					<h1 className="text-4xl">SharingApp</h1>
				</center>
				<h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight to-blue-500">
					Sign Up to continue
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							for="fname"
							className="block text-sm font-medium leading-6 text-balance">
							First Name
						</label>
						<div className="mt-2">
							<input
								id="fname"
								name="fname"
								type="text"
								autocomplete="name"
								required
								style={{ color: "black" }}
								className="block px-1 w-full rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-balck sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<label
							for="lname"
							className="block text-sm font-medium leading-6 text-balance">
							Last Name
						</label>
						<div className="mt-2">
							<input
								id="lname"
								name="lname"
								type="text"
								autocomplete="name"
								required
								style={{ color: "black" }}
								className="block px-1 w-full rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-balck sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<label
							for="email"
							className="block text-sm font-medium leading-6 text-balance">
							Email address
						</label>
						<div className="mt-2">
							<input
								id="email"
								name="email"
								type="email"
								style={{ color: "black" }}
								autocomplete="email"
								required
								className="block px-1 w-full rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-balck sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label
								for="password"
								className="block text-sm font-medium leading-6 text-black">
								Password
							</label>
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								autocomplete="current-password"
								required
								style={{ color: "black" }}
								className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<div className="flex items-center justify-between">
							<label
								for="cpass"
								className="block text-sm font-medium leading-6 text-black">
								Confirm password
							</label>
						</div>
						<div className="mt-2">
							<input
								id="cpass"
								name="cpass"
								type="password"
								autocomplete="current-password"
								required
								style={{ color: "black" }}
								className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
							disabled={isLoading}>
							{isLoading ? "Loading..." : "Register"}
						</button>
					</div>
				</form>

				<p className="mt-10 text-center text-sm text-gray-400">
					Already a member?
					<Link
						to="/login"
						className="font-semibold leading-6 text-red-500 hover:text-red-400">
						Login Here.
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
