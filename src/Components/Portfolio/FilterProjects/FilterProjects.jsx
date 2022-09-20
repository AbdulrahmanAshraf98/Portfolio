import React from "react";

const FilterProjects = ({ allCategory, selectedCategoryHandler, active }) => {
	return allCategory.map((category, index) => (
		<button
			key={index}
			className={` text-sm  sm:text-base md:text-lg text-center text-white w-fit px-6 py-3 my-2 flex items-center rounded-md ${
				active === category
					? "bg-gradient-to-r from-cyan-500 to-blue-500 "
					: "bg-transparent"
			}  ease duration-1000  cursor-pointer`}
			value={category}
			onClick={selectedCategoryHandler}>
			{category}
		</button>
	));
};

export default React.memo(FilterProjects);
