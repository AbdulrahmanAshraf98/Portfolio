import React from "react";
import ProjectCardItem from "./ProjectCardItem/ProjectCardItem";

const Projects = ({ projects }) => {
	return projects.map((project) => (
		<ProjectCardItem key={project.id} project={project} />
	));
};

export default React.memo(Projects);
