import { ProjectWithImages } from "../../../types";
import { client } from "../client";
import { mapProjectWithImages } from "./utils";

const listProjects = async (): Promise<ProjectWithImages[]> => {
  const { data, error, status } = await client.from("projects").select(
    `
      *,
      images (
        *
      )
    `,
  );

  if (error) {
    throw error;
  }

  if (status !== 200) {
    throw new Error("Could not fetch projects");
  }

  const projects = data.map((data) => mapProjectWithImages(data)) || [];

  return Promise.resolve(projects);
};

export default listProjects;
