import React from "react";

const SkillsCard = ({ className, item }) => {
	return (
		<div
			className={`card ${item.shadowColor} shadow-md  ${item.shadowColorHover} hover:shadow-lg  py-4  sm:py-2 rounded-lg duration-500`}>
			<div className="card_image overflow-hidden mb-4 ">
				<img
					className=" w-20 mx-auto h-20 sm:h-40  object-contain"
					src={item.icon__url}
				/>
			</div>
			<div className="card__content text-center">
				<p className="">{item.name}</p>
			</div>
		</div>
	);
};

export default SkillsCard;
