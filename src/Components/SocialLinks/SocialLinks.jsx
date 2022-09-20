import React from "react";
import { SOCIAL__LINKS } from "../../utilities/Constant/Data/SocialLinks/socialLinks";

function SocialLinks() {
	return SOCIAL__LINKS.map((socialLink) => (
		<div key={socialLink.id}>
			<a href={socialLink.link} target="_blank" rel="noreferrer">
				{socialLink.icon}
			</a>
		</div>
	));
}

export default SocialLinks;
