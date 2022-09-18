import React, { useCallback, useState } from "react";
import { LINKS } from "../../utilities/Constant/Data/Links/links";
import { FaBars, FaTimes } from "react-icons/fa";
import { Transition } from "react-transition-group";
const Navbar = () => {
	const [navOpen, setNavOpen] = useState(false);
	const toggleNav = useCallback(() => {
		setNavOpen((prevState) => !prevState);
	}, []);
	return (
		<nav className=" w-full h-20 fixed px-2 bg-black text-white z-30">
			<div className="container m-auto h-full">
				<div className="flex justify-between items-center h-full">
					<div className="nav__logo pl-2">
						<h1 className="text-4xl font-signature">AS</h1>
					</div>
					<ul className="nav__links hidden md:flex">
						{LINKS.map((link) => (
							<li
								className="nav__links-item p-4  capitalize font-medium text-gray-300  hover:scale-105  duration-200  cursor-pointer"
								key={link.id}>
								<a href={`#${link.name}`}>{link.name}</a>
							</li>
						))}
					</ul>
					<div
						className="md:hidden nav__toggler cursor-pointer pr-4 text-gray-100 z-30"
						onClick={toggleNav}>
						{navOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
					</div>
					<Transition in={navOpen} timeout={1000} mountOnEnter unmountOnExit>
						{(state) => (
							<ul
								className={`flex  flex-col justify-center items-center absolute  w-full h-screen top-0 left-0 bg-gradient-to-b from-black to-gray-800  origin-top-right duration-500 ${
									state === "entering"
										? "opacity-100  scale-100 "
										: state === "exiting"
										? "opacity-0 scale-0"
										: ""
								}`}>
								{LINKS.map((link) => (
									<li
										className={`nav__links-item  w-full text-center capitalize font-medium p-6 text-gray-300  text-4xl  hover:scale-105   cursor-pointer ${
											state === "entering"
												? "opacity-100  scale-100 duration-1000"
												: state === "exiting"
												? "opacity-0 scale-0  "
												: ""
										}`}
										key={link.id}>
										<a href={`#${link.name}`}>{link.name}</a>
									</li>
								))}
							</ul>
						)}
					</Transition>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
