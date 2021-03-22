import { RulePackLink } from "../rule-pack-constructor/rule-pack-constructor.types";
import { MathInputFormat } from "../../utils/kotlin-lib-functions";

export interface ExpressionInput {
  format: MathInputFormat;
  expression: string;
}

export enum GoalType {
  CUSTOM = "CUSTOM",
  EXPRESSION = "EXPRESSION",
  COMPUTATION = "COMPUTATION",
  SIMPLIFICATION = "SIMPLIFICATION",
  CNF = "CNF",
  DNF = "DNF",
  FACTORIZATION = "FACTORIZATION",
  UNKNOWN = "UNKNOWN",
}

export interface TaskConstructorProps {
  index: number;
  defaultValue: any;
  updateDemo: (index: number) => void;
  visualizationMode: "table" | "list";
  isRendered?: boolean;
  updateName?: (index: number, newName: string) => void;
  rulePacks: string[];
}

export interface TaskConstructorReceivedForm {
  namespaceCode: string;
  code: string;
  nameEn: string;
  nameRu: string;
  subjectTypes: string[];
  originalExpressionStructureString: string;
  originalExpressionTex: string;
  originalExpressionPlainText: string;
  goalType: GoalType;
  goalExpressionStructureString: string;
  goalExpressionTex: string;
  goalExpressionPlainText: string;
  goalPattern: string;
  goalNumberProperty: number;
  rulePacks: RulePackLink[];
  stepsNumber: number;
  time: number;
  difficulty: number;
  solution: string;
  countOfAutoGeneratedTasks: number;
  operations: string;
  stepsCountIntervals: string;
  implicitTransformationsCount: string;
  autoGeneratedRulePacks: any;
  lightWeightOperations: string;
  nullWeightOperations: string;
  maxNumberOfAutogeneratedTasks: number;
  numberOfAutogeneratedTasksToSolve: number;
  otherGoalData?: any;
  otherCheckSolutionData?: any;
  otherAwardData?: any;
  otherAutogenerationData?: any;
  otherData?: any;
}

export interface TaskConstructorInputs {
  taskCreationType: "auto" | "manual";
  namespaceCode: string;
  code: string;
  nameEn: string;
  nameRu: string;
  subjectTypes: string[] | string;
  originalExpression: ExpressionInput;
  goalType: GoalType;
  goalExpression: ExpressionInput;
  goalPattern: string;
  goalNumberProperty: number;
  rulePacks: string[] | string;
  stepsNumber: number;
  time: number;
  difficulty: number;
  solution: ExpressionInput;
  countOfAutoGeneratedTasks: number;
  operations: string;
  stepsCountIntervals: string;
  implicitTransformationsCount: string;
  autoGeneratedRulePacks: any;
  lightWeightOperations: string;
  nullWeightOperations: string;
  maxNumberOfAutogeneratedTasks: number;
  numberOfAutogeneratedTasksToSolve: number;
  otherGoalData?: any;
  otherCheckSolutionData?: any;
  otherAwardData?: any;
  otherAutogenerationData?: any;
  otherData?: any;
}
