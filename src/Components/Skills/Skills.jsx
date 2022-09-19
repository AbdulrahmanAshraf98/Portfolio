import React from "react";
import { SKILLS } from "../../utilities/Constant/Data/Skills/skills";
import SkillsCard from "./SkillsCard/SkillsCard";

const Skills = () => {
	return (
		<section className="skills pb-16 md:py-16 w-full bg-gradient-to-b from-black  to-gray-800 text-white">
			<div className="container  m-auto h-full px-8  lg:px-16 ">
				<div className="flex items-center">
					<div className="skills__content w-full">
						<div class="skills__content__title mb-12">
							<h3 className="text-4xl font-bold inline border-b-4 border-gray-500">
								Skills
							</h3>
						</div>
						<div className="skills__items grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-16 sm:gap-8 w-full ">
							{SKILLS.map((item) => (
								<SkillsCard item={item} key={item.id} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Skills;
