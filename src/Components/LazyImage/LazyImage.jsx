import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyImage = ({ className, wrapperClassName, image }) => (
	<LazyLoadImage
		className={className}
		wrapperClassName={wrapperClassName}
		alt={image.alt}
		effect="blur"
		src={image.src}
		placeholderSrc={image.lazy}
	/>
);
export default LazyImage;
