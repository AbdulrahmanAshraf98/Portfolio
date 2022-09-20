import React, { useState } from "react";
import ProjectCardItem from "./ProjectCardItem/ProjectCardItem";
import { PROJECTS__DATA } from "../../utilities/Constant/Data/ProjectsData/projectsData";

const Portfolio = () => {
	const [Projects, setProjects] = useState(PROJECTS__DATA);
	return (
		<section
			id=""
			className="portfolio py-16 bg-gradient-to-b from-gray-800 via-black to-black text-white">
			<div className="container  m-auto h-full px-8  lg:px-16">
				<div class="portfolio__content__title mb-12">
					<h3 className="text-4xl  font-bold inline border-b-4 border-gray-500">
						Portfolio
					</h3>
				</div>

				<div className="projects__items w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
					{Projects.map((project) => (
						<ProjectCardItem key={project.id} project={project} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Portfolio;
