import React from "react";
import Education from "../Education/Education";
import Experience from "../Experience/Experience";

function Resume() {
	return (
		<section
			id="Resume"
			className="resume  py-16 w-full bg-gradient-to-b from-black via-gray-800 to-black text-white">
			<div className="container  m-auto h-full px-8  lg:px-16 ">
				<div className="flex flex-wrap justify-between items-start gap-1">
					<div className="eduction w-full lg:w-6/12 mb-8  lg:mb-0">
						<Education />
					</div>
					<div className="eduction w-full lg:w-5/12 ">
						<Experience />
					</div>
				</div>
			</div>
		</section>
	);
}

export default Resume;
