import React from "react";
import HeroImage from "../../assets/Profile.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
const Home = () => {
	return (
		<section
			id="Home"
			className="hero-section text-5xl text-gray-800 w-full  bg-gradient-to-b from-black via-black to-gray-800  h-100 py-16 ">
			<div class="container m-auto px-8 lg:px-16   h-full">
				<div className="flex flex-wrap justify-between items-center h-full">
					<div className="hero-section__content w-full md:w-6/12  text-gray-200 flex flex-col justify-center  order-2 md:order-1">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
							I am Front End Developer
						</h2>
						<p className="text-lg text-gray-500 py-8 max-w-2xl">
							I am passionate frontend developer from Egypt I Graduated from
							faculty of commerce department of Business information systems,
							Helwan university (2016- 2020) with Very Good grade.Seeking a job
							in the field of “Front End Development” in a reputable
							organization where gain experience. Eager to learn every day and
							gain more experience in different fields related to technology
						</p>
						<div>
							<button className="group text-xl text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer">
								Portfolio
								<span class="group-hover:rotate-90 duration-300">
									<MdKeyboardArrowRight size={25} />
								</span>
							</button>
						</div>
					</div>
					<div className="hero-section__image w-full md:w-5/12  bg-gradient-to-b from-blue-400 to-black rounded-2xl order-1 md:order-2 mb-8 md:mb-0">
						<img
							className=" mx-auto w-full md:W-full object-cover"
							src={HeroImage}
							alt="ProfileImage"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Home;
