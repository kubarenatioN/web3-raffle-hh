const env = import.meta.env;

const {
  VITE_SUBGRAPH_BASE_URL: baseURL,
  VITE_SUBGRAPH_USER_ID: userId,
  VITE_SUBGRAPH_SLUG: slug,
} = env;

export const gqlPath = () => `${baseURL}/${userId}/${slug}/version/latest`;
