import { VisualizationMode } from "../task-set-constructor/task-set-constructor.component";

export type TaskCreationType = "auto" | "manual";

export interface TaskConstructorInputs {
  nameEn: string;
  nameRu: string;
  code: string;
  goalPattern: string;
  namespace: string;
  taskCreationType: TaskCreationType;
  startExpression: string;
  goalType: string;
  goalExpression: string;
  goalNumberProperty: number;
  subjectTypes: string;
  additionalPacks: string;
  customLevelPack: string;
  expectedSteps: number;
  expectedTime: number;
  levelCode: string;
  autoGeneratedLevelsCount: number;
  operations: string;
  stepsCountInterval: string;
  implicitTransformationsCount: number;
}

export interface TaskConstructorProps {
  index: number;
  defaultValue: any;
  taskCreationType: TaskCreationType;
  updateDemo: (index: number) => void;
  visualizationMode: VisualizationMode;
  hidden?: boolean;
  updateName?: (index: number, newName: string) => void;
  // // methods from react-use-form lib
  // remove: (index: number) => void;
  // swap: (from: number, to: number) => void;
  // append: (level: TaskConstructorInputs) => void;
}
