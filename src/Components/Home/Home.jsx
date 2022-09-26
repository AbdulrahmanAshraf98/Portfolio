import React from "react";
import LazyHeroImage from "../../assets/ProfileLazy.webp";
import HeroImage from "../../assets/Profile.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import LazyImage from "../LazyImage/LazyImage";
const Home = () => {
	return (
		<section
			id="Home"
			className="hero-section text-5xl text-gray-800 w-full  bg-gradient-to-b from-black via-black to-gray-800  h-100 py-8 md:py-16 ">
			<div className="container m-auto px-8 lg:px-16   h-full">
				<div className="flex flex-wrap justify-between items-center h-full">
					<div className="hero-section__content w-full md:w-6/12  text-gray-200 flex flex-col justify-center  order-2 md:order-1">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
							I am Front End Developer
						</h2>
						<p className="text-lg text-gray-500 py-8 max-w-2xl">
							I am a frontend web developer. I can provide clean code and pixel
							perfect design. I also make website more & more interactive with
							web animations.
						</p>
						<div className="flex flex-wrap gap-4">
							<a
								href="#Portfolio"
								className="group text-lg sm:text-xl text-white w-fit px-3 sm:px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer">
								Portfolio
								<span className="group-hover:rotate-90 duration-300">
									<MdKeyboardArrowRight size={25} />
								</span>
							</a>
							<a
								href="https://drive.google.com/file/d/19F18VjW9vtTbOsqZdt-jmghjUPnV6QXf/view?usp=sharing"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-lg sm:text-xl text-white w-fit px-10 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-blue-500 via-blue-500 to-cyan-500 cursor-pointer">
								Cv
							</a>
						</div>
					</div>
					<div className="hero-section__image w-full md:w-5/12   order-1 md:order-2 mb-8 md:mb-0">
						<LazyImage
							image={{
								alt: "ProfileImage",
								src: HeroImage,
								lazy: LazyHeroImage,
							}}
							wrapperClassName="block w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-400 via-black to-black "
							className=" object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Home;
