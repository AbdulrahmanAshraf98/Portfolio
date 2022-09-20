import React from "react";
import LazyImage from "../../../LazyImage/LazyImage";

const ProjectCardItem = ({ project }) => {
	return (
		<div className="project__item shadow-md shadow-gray-600 rounded-lg flex flex-wrap w-full">
			<div className="project__item__image  w-full">
				<LazyImage
					wrapperClassName="block rounded-md overflow-hidden   h-80  w-full "
					className=" rounded-md  object-cover object-top h-80 w-full"
					image={{
						alt: project.name,
						src: project.image__Src,
						lazy: project.lazyImage__Src,
					}}
				/>
			</div>
			<div className="project__item__info my-4 px-4 relative  w-full">
				<h3 className="text-xl mb-4">{project.name}</h3>
				<div className="project__item__tech w-full   flex  flex-wrap  items-center gap-2">
					{project.technologies.map((item, index) => (
						<p className=" p-2 border-2 border-gray-800 w-fit" key={index}>
							{item}
						</p>
					))}
				</div>
			</div>
			<div className="project__item__links w-full flex justify-center items-center gap-4 border-t-2 border-gray-500 mt-auto">
				<a
					className="w-1/3 px-4 py-3 text-base cursor-pointer"
					href={project.livePreview__Url}
					target="_blank"
					rel="noopener noreferrer">
					Live
				</a>
				<a
					className="w-1/3 px-4 py-3 text-base cursor-pointer"
					href={project.github__Url}
					target="_blank"
					rel="noopener noreferrer">
					Code
				</a>
				<a
					className="w-1/3 px-4 py-3 text-base cursor-pointer"
					href={project.video__Url}
					target="_blank"
					rel="noopener noreferrer">
					Video
				</a>
			</div>
		</div>
	);
};

export default ProjectCardItem;
