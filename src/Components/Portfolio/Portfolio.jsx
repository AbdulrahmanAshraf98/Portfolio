import React, { useCallback, useEffect, useState } from "react";
import { PROJECTS__DATA } from "../../utilities/Constant/Data/ProjectsData/projectsData";
import FilterProjects from "./FilterProjects/FilterProjects";
import Projects from "./Projects/Projects";
const allTechnologies = PROJECTS__DATA.reduce((accumulator, current) => {
	accumulator = [...accumulator, ...current.categories];
	return accumulator;
}, []);
const allCategory = ["All", ...new Set(allTechnologies)];
const Portfolio = () => {
	const [projects, setProjects] = useState(PROJECTS__DATA);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const selectedCategoryHandler = useCallback((event) => {
		setSelectedCategory(event.target.value);
	}, []);
	const getProjects = () => {
		let filterProject = PROJECTS__DATA;
		if (selectedCategory !== "All") {
			filterProject = filterProject.filter(
				(project) => project.categories.indexOf(selectedCategory) !== -1,
			);
		}
		setProjects(filterProject);
	};
	useEffect(() => {
		getProjects();
	}, [selectedCategory]);

	return (
		<section
			id="Portfolio"
			className="portfolio py-16 bg-gradient-to-b from-gray-800 via-black to-black text-white">
			<div className="container  m-auto h-full px-8  lg:px-16">
				<div class="portfolio__content__title mb-12">
					<h3 className="text-4xl  font-bold inline border-b-4 border-gray-500">
						Portfolio
					</h3>
				</div>
				<div className="categoriesFilter overflow-y-auto my-8">
					<div className="categoriesFilterButtons flex md:flex-wrap gap:4 ">
						<FilterProjects
							allCategory={allCategory}
							selectedCategoryHandler={selectedCategoryHandler}
							active={selectedCategory}
						/>
					</div>
				</div>

				<div className="projects__items w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
					<Projects projects={projects} />
				</div>
			</div>
		</section>
	);
};

export default Portfolio;
