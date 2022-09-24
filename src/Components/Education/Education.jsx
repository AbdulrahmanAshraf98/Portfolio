import React from "react";
import { EDUCTION } from "../../utilities/Constant/Data/Eduction/eduction";
import TimeLine from "../TimeLine/TimeLine";

function Education() {
	return (
		<div className="eduction">
			<div className="eduction__content ">
				<div className="eduction__content__title mb-12">
					<h3 className="text-4xl font-bold inline border-b-4 border-gray-500">
						Eduction
					</h3>
				</div>
			</div>
			{EDUCTION.map((educationItem) => (
				<TimeLine
					key={educationItem.id}
					TimelineItem={{
						date: educationItem.date,
						title: educationItem.degree,
						subtitle: educationItem.from,
						content: educationItem.content,
					}}
				/>
			))}
		</div>
	);
}

export default Education;
