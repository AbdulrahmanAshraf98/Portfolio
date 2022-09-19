import React from "react";

function TimeLine({ TimelineItem }) {
	return (
		<div className="timeline ">
			<div className="dot"></div>
			<div className="ml-5 pl-10 lg:pl-4 py-8 mt-0 shadow-sm shadow-gray-200">
				<div className="timeline-date">{TimelineItem.date}</div>
				<h3 className="timeline-title">{TimelineItem.title}</h3>
				<h6 className="timeline-subtitle">{TimelineItem.subtitle}</h6>
				{TimelineItem.content &&
					TimelineItem.content.map((contentItem, index) => (
						<p className="timeline-content text-md mb-2" key={index}>
							{contentItem}
						</p>
					))}
			</div>
		</div>
	);
}

export default TimeLine;
