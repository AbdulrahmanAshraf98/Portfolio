import { cache } from "react";
import type { Portfolio } from "./types";

const PORTFOLIO_QUERY = `
  query Portfolio {
    portfolio {
      profile {
        id fullName logoText headline summary about location email phone cvUrl imageUrl imageLazyUrl
      }
      experiences { id jobTitle company dateRange focus bullets sortOrder }
      educations { id degree school dateRange details sortOrder }
      skills { id name group iconUrl shadowColor shadowColorHover sortOrder }
      projects { id name slug description company bullets imageUrl lazyImageUrl liveUrl githubUrl videoUrl technologies categories featured published sortOrder }
      socialLinks { id name url sortOrder }
      contacts { id title info sortOrder }
      highlights { id title subtitle description date mediaUrl fileUrl linkUrl sortOrder }
      certificates { id title issuer issueDate credentialUrl imageUrl fileUrl sortOrder }
      settings { signatureText linkedinUrl xUrl sectionOrder }
    }
  }
`;

export const fetchPortfolio = cache(async (): Promise<Portfolio> => {
  const endpoint = process.env.GRAPHQL_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!endpoint || !secret) {
    throw new Error("Server is not configured");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-key": secret,
    },
    body: JSON.stringify({ query: PORTFOLIO_QUERY }),
    next: { revalidate: 30 },
  });
  const json = (await response.json()) as {
    data?: { portfolio: Portfolio };
    errors?: { message: string }[];
  };
  if (!response.ok || json.errors?.length || !json.data?.portfolio) {
    throw new Error(json.errors?.[0]?.message ?? "Failed to load portfolio");
  }
  return {
    highlights: [],
    certificates: [],
    ...json.data.portfolio,
  };
});
