import { GoalType } from "../task-constructor/task-constructor.types";
import { TaskConstructorInputs } from "../task-constructor/task-constructor.types";
import { MathInputFormat } from "../../utils/kotlin-lib-functions";

export const taskConstructorDefaultValues: TaskConstructorInputs = {
  taskCreationType: "manual",
  namespaceCode: "",
  code: "",
  nameEn: "",
  nameRu: "",
  descriptionEn: "",
  descriptionRu: "",
  descriptionShortEn: "",
  descriptionShortRu: "",
  subjectType: "",
  tags: [],
  originalExpression: {
    format: MathInputFormat.TEX,
    expression: "",
  },
  goalType: GoalType.CUSTOM,
  goalExpression: {
    format: MathInputFormat.TEX,
    expression: "",
  },
  goalPattern: "",
  otherGoalData: "",
  rulePacks: [],
  stepsNumber: 0,
  time: 0,
  difficulty: 0,
  solution: {
    format: MathInputFormat.TEX,
    logicPreposition: "",
  },
  solutionsStepsTree: "",
  rules: [],
  hints: "",
  otherCheckSolutionData: "",
  countOfAutoGeneratedTasks: 0,
  otherAutoGenerationData: "",
  interestingFacts: "",
  otherAwardData: "",
  nextRecommendedTasks: "",
  otherData: "",
};

export const mockTaskSetSubjectTypes = [
  "subject type 1",
  "subject type 2",
  "subject type 3",
  "subject type 4",
  "subject type 5",
  "subject type 6",
  "subject type 7",
  "subject type 8",
  "subject type 9",
  "subject type 10",
];
