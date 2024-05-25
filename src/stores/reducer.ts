import { Image, ImageWithProjects, Project, ProjectWithImages } from "../types";

type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum DataKey {
  Images = "images",
  Projects = "projects",
  ProjectsImages = "projectsImages",
}

export interface DataSet<T> {
  data: Map<string, T>;
  isLoaded: boolean;
}

export interface ProjectImage {
  imageId: string;
  projectId: string;
}

export type ProjectsImages = ProjectImage[];

export interface State {
  [DataKey.Images]: DataSet<Image>;
  [DataKey.Projects]: DataSet<Project>;
  [DataKey.ProjectsImages]: ProjectsImages;
}

export const initialState = {
  [DataKey.Images]: {
    data: new Map(),
    isLoaded: false,
  },
  [DataKey.Projects]: {
    data: new Map(),
    isLoaded: false,
  },
  [DataKey.ProjectsImages]: [],
};

export enum Types {
  SET_IMAGES = "SET_IMAGES",
  SET_PROJECT = "SET_PROJECT",
  SET_PROJECTS = "SET_PROJECTS",
}

type Payload = {
  [Types.SET_IMAGES]: ImageWithProjects[];
  [Types.SET_PROJECT]: ProjectWithImages;
  [Types.SET_PROJECTS]: ProjectWithImages[];
};

interface NormaliseProjectsArgs {
  projects: ProjectWithImages[];
  state: State;
}

const normaliseProjects = ({ projects, state }: NormaliseProjectsArgs) => {
  const data: State = { ...state };

  projects.forEach((project) => {
    project.images.forEach((image) => {
      data.images.data.set(image.id, image);
      data.projectsImages.push({
        imageId: image.id,
        projectId: project.id,
      });
    });
    const nextProject = {
      ...project,
      images: [],
    };
    data.projects.data.set(nextProject.id, nextProject);
  });

  return data;
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case Types.SET_PROJECTS: {
      const data = normaliseProjects({
        projects: action.payload,
        state,
      });
      data.projects.isLoaded = true;

      return data;
    }

    case Types.SET_PROJECT: {
      const data = normaliseProjects({
        projects: [action.payload],
        state,
      });

      return data;
    }

    case Types.SET_IMAGES: {
      const data: State = { ...state };

      action.payload.forEach((image) => {
        image.projects.forEach((project) => {
          data.projects.data.set(project.id, project);
          data.projectsImages.push({
            imageId: image.id,
            projectId: project.id,
          });
        });
        const nextImage = {
          ...image,
          projects: [],
        };
        data.images.data.set(nextImage.id, nextImage);
      });
      data.images.isLoaded = true;

      return {
        ...state,
        ...data,
      };
    }
    default:
      return state;
  }
};

export default reducer;
