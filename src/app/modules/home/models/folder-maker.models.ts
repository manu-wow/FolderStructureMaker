export interface FolderModel {
    type: string;
    name: string;
    id: string | number;
    children?: FolderModel[];
  }
