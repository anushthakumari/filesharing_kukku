import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import axios from "../libs/axios.lib";
import { useAuthState } from "../contexts/AuthProvider";

const Login = () => {
	const [isLoading, setisLoading] = useState(false);
	const navigate = useNavigate();
	const { saveUser } = useAuthState();

	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const body = {};
		formData.forEach(function (value, key) {
			body[key] = value;
		});

		setisLoading(true);
		axios
			.post("/users/login", body)
			.then((r) => {
				saveUser(r.data);
				alert("Logged in successfully!");
				navigate("/");
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

	const responseMessage = (response) => {
		setisLoading(true);
		axios
			.post("/users/login", { token: response.credential })
			.then((r) => {
				saveUser(r.data);
				alert("Logged in successfully!");
				navigate("/");
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
	const errorMessage = (error) => {
		console.log(error);
	};

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<center>
					<h1 className="text-4xl">SharingApp</h1>
				</center>
				<h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight to-blue-500">
					Sign In to continue
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit}>
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
								autocomplete="email"
								style={{ color: "black" }}
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
								className="block px-1 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
							disabled={isLoading}>
							{isLoading ? "Loading..." : "Login"}
						</button>
					</div>
				</form>

				<div className="w-100 flex items-center justify-center mt-6">
					<GoogleLogin
						onSuccess={responseMessage}
						onError={errorMessage}
						flow
					/>
				</div>

				<p className="mt-10 text-center text-sm text-gray-400">
					Do not have an account?
					<Link
						to="/register"
						className="font-semibold leading-6 text-red-500 hover:text-red-400">
						Register.
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
