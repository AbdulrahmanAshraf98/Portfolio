import React from "react";
import { EXPERIENCE } from "../../utilities/Constant/Data/WorkExperience/workExperience";
import TimeLine from "../TimeLine/TimeLine";

function Experience() {
	return (
		<div className="eduction">
			<div className="eduction__content ">
				<div class="eduction__content__title mb-12">
					<h3 className="text-4xl font-bold inline border-b-4 border-gray-500">
						Experience
					</h3>
				</div>
			</div>
			{EXPERIENCE.map((ExperienceItem) => (
				<TimeLine
					key={ExperienceItem.id}
					TimelineItem={{
						date: ExperienceItem.date,
						title: ExperienceItem.jobTitle,
						subtitle: ExperienceItem.from,
						content: ExperienceItem.info,
					}}
				/>
			))}
		</div>
	);
}

export default Experience;
