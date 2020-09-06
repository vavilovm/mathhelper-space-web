// libs
import React, { RefObject, useState } from "react";
// hooks
import { useFormContext } from "react-hook-form";
import useMergedRef from "@react-hook/merged-ref";
// redux
import { connect, MapDispatchToProps } from "react-redux";
import { selectAllLevelsHiddenFields } from "../../redux/levels-hidden-fields/levels-hidden-fields.selectors";
import { createStructuredSelector } from "reselect";
import {
  toggleFieldVisibilityForAllAutoLevels,
  toggleFieldVisibilityForAllManualLevels,
} from "../../redux/levels-hidden-fields/levels-hidden-fields.actions";
import watch from "redux-watch";
// components
import Icon from "@mdi/react";
import AppModal from "../app-modal/app-modal";
import MixedInput from "../mixed-input/mixed-input";
// types
import { AllLevelsHiddenFields } from "../../redux/levels-hidden-fields/levels-hidden-fields.types";
// styles
import "./level-form.scss";
// icons
import {
  mdiArrowDown,
  mdiArrowExpandDown,
  mdiArrowExpandLeft,
  mdiArrowExpandRight,
  mdiArrowExpandUp,
  mdiArrowUp,
  mdiClose,
  mdiContentCopy,
  mdiEye,
  mdiEyeOff,
  mdiFileEye,
  mdiPlayCircle,
  mdiRobot,
  mdiWrench,
} from "@mdi/js";
import store from "../../redux/store";
import { VisualizationMode } from "../../pages/create-game-page/create-game-page";

export enum LevelType {
  AUTO = "автоматический",
  MANUAL = "ручной",
}

export interface Level {
  name: string;
  levelType: LevelType;
  startExpression: string;
  goalType: string;
  goalExpression: string;
  goalNaturalNumber: number;
  subjectTypes: string;
  additionalPacks: string;
  customLevelPack: string;
  expectedSteps: number;
  expectedTime: number;
  levelNameEn: string;
  levelNameRu: string;
  levelCode: string;
  autoGeneratedLevelsCount: number;
  operations: string;
  stepsCountInterval: string;
  implicitTransformationsCount: number;
}

export interface LevelFormProps {
  index: number;
  defaultValue: any;
  levelType: LevelType;
  updateDemo: (index: number) => void;
  visualizationMode: VisualizationMode;
  hidden?: boolean;
  // methods from react-use-form lib
  remove: (index: number) => void;
  swap: (from: number, to: number) => void;
  append: (level: Level) => void;
}

interface MapProps {
  toggleFieldVisibilityForAllManualLevels: (fieldName: string) => any;
  toggleFieldVisibilityForAllAutoLevels: (fieldName: string) => any;
}

interface StateProps {
  allLevelsHiddenFields: AllLevelsHiddenFields;
}

type Props = LevelFormProps & MapProps & StateProps;

const LevelForm: React.FC<Props> = ({
  index,
  defaultValue,
  hidden,
  remove,
  swap,
  append,
  updateDemo,
  levelType,
  visualizationMode,
  allLevelsHiddenFields,
  toggleFieldVisibilityForAllManualLevels,
  toggleFieldVisibilityForAllAutoLevels,
}: Props) => {
  const { register, getValues } = useFormContext();

  const goalTypes = [
    "Сведение к целевому выражению",
    "Сведение к КНФ",
    "Сведение к ДНФ",
    "Разложения на множители",
    "Вычисление",
    "Сокращение",
    "Упрощение",
    "Другое",
  ];
  const [goalType, setGoalType] = useState(
    defaultValue.goalType || "Сведение к целевому выражению"
  );
  const startExpressionRef: RefObject<HTMLInputElement> = React.createRef();
  const goalExpressionRef: RefObject<HTMLInputElement> = React.createRef();

  const [localHiddenFields, setLocalHiddenFields] = useState<any>(
    (() =>
      levelType === LevelType.AUTO
        ? allLevelsHiddenFields.autoLevelsHiddenFields
        : allLevelsHiddenFields.manualLevelsHiddenFields)()
  );
  const [showHiddenFieldsModal, setShowHiddenFieldsModal] = useState(false);

  const toggleFieldVisibilityForAllLevels = (fieldName: string): void => {
    setLocalHiddenFields((prevState: any) => {
      return { ...prevState, [fieldName]: !prevState[fieldName] };
    });
    levelType === LevelType.AUTO
      ? toggleFieldVisibilityForAllAutoLevels(fieldName)
      : toggleFieldVisibilityForAllManualLevels(fieldName);
  };

  const w = watch(() => selectAllLevelsHiddenFields(store.getState()));
  store.subscribe(
    w((newVal, oldVal) => {
      const levelTypeNewVal =
        levelType === LevelType.MANUAL
          ? newVal.manualLevelsHiddenFields
          : newVal.autoLevelsHiddenFields;
      const levelTypeOldVal =
        levelType === LevelType.MANUAL
          ? oldVal.manualLevelsHiddenFields
          : oldVal.autoLevelsHiddenFields;
      for (const key in levelTypeNewVal) {
        if (levelTypeOldVal[key] !== levelTypeNewVal[key]) {
          setLocalHiddenFields((prevState: any) => {
            return {
              ...prevState,
              [key]: levelTypeNewVal[key],
            };
          });
        }
      }
    })
  );

  const ActionButton = ({
    action,
    mdiIconPath,
    size,
    margin,
  }: {
    mdiIconPath: string;
    size: number;
    action: () => any;
    margin?: string;
  }): JSX.Element => {
    return (
      <button
        className="level-form__action-button"
        style={{ margin: margin ? margin : "" }}
        onClick={() => {
          action();
        }}
      >
        <Icon path={mdiIconPath} size={size} />
      </button>
    );
  };

  const inputs: { [key: string]: JSX.Element } = {
    levelType: (
      <div className="form-group">
        <label>Тип уровня</label>
        <input
          type="text"
          className="form-control"
          name={`levels[${index}].levelType`}
          defaultValue={defaultValue.levelType}
          ref={register()}
          readOnly
        />
      </div>
    ),
    name: (
      <div className="form-group">
        <label>Имя</label>
        <input
          type="text"
          className="form-control"
          name={`levels[${index}].name`}
          defaultValue={defaultValue.name}
          ref={register()}
        />
      </div>
    ),
    startExpression: (
      <div
        className="form-group"
        style={{
          display:
            levelType === LevelType.AUTO && localHiddenFields.startExpression
              ? "none"
              : "block",
        }}
      >
        <label>Стартовое выражение</label>
        {levelType === LevelType.AUTO && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() => toggleFieldVisibilityForAllLevels("startExpression")}
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].startExpression`}
          // className="form-control"
          type="text"
          // eslint-disable-next-line
          ref={useMergedRef(register(), startExpressionRef)}
          defaultValue={defaultValue.startExpression}
        />
        <MixedInput
          inputRef={startExpressionRef}
          width={`${
            visualizationMode === VisualizationMode.LIST ? "65vw" : "40rem"
          }`}
        />
      </div>
    ),
    goalType: (
      <div
        className="form-group"
        style={{
          display:
            levelType === LevelType.AUTO && localHiddenFields.goalType
              ? "none"
              : "block",
        }}
      >
        <label>Тип цели</label>
        {defaultValue.levelType === LevelType.AUTO && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() => toggleFieldVisibilityForAllLevels("goalType")}
            margin="0 0 0 0.5rem"
          />
        )}
        <select
          name={`levels[${index}].goalType`}
          className="form-control"
          ref={register()}
          value={goalType}
          onChange={(event: any) => {
            setGoalType(event.target.value);
          }}
        >
          {goalTypes.map((type: string, i) => {
            return <option key={i}>{type}</option>;
          })}
        </select>
      </div>
    ),
    goalDetails: (
      <>
        <div
          className="form-group"
          style={{
            display:
              defaultValue.levelType === LevelType.AUTO &&
              localHiddenFields.goalExpression
                ? "none"
                : goalType === "Сведение к целевому выражению" ||
                  goalType === "Упрощение"
                ? "block"
                : "none",
          }}
        >
          <label>Конечное выражение</label>
          {defaultValue.levelType === LevelType.AUTO && (
            <ActionButton
              mdiIconPath={mdiEye}
              size={1.5}
              action={() => toggleFieldVisibilityForAllLevels("goalExpression")}
              margin="0 0 0 0.5rem"
            />
          )}
          <input
            name={`levels[${index}].goalExpression`}
            className="form-control"
            type="text"
            // eslint-disable-next-line
            ref={useMergedRef(register(), goalExpressionRef)}
            defaultValue={defaultValue.goalExpression}
          />
          <MixedInput
            inputRef={goalExpressionRef}
            width={`${
              visualizationMode === VisualizationMode.LIST ? "65vw" : "40rem"
            }`}
          />
        </div>
        <div
          className="form-group"
          style={{
            display:
              goalType === "Сведение к КНФ" || goalType === "Сведение к ДНФ"
                ? "block"
                : "none",
          }}
        >
          <label>Натуральное число</label>
          <input
            name={`levels[${index}].goalNaturalNumber`}
            className="form-control"
            type="number"
            ref={register()}
            defaultValue={defaultValue.goalNaturalNumber}
          />
        </div>
      </>
    ),
    subjectTypes: (
      <div
        className="form-group"
        style={{
          display:
            defaultValue.levelType === LevelType.MANUAL &&
            localHiddenFields.subjectTypes
              ? "none"
              : "block",
        }}
      >
        <label>Предметая область</label>
        {defaultValue.levelType === LevelType.MANUAL && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() => toggleFieldVisibilityForAllLevels("subjectTypes")}
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].subjectTypes`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.subjectTypes}
        />
      </div>
    ),
    additionalPacks: (
      <div
        className="form-group"
        style={{
          display: localHiddenFields.additionalPacks ? "none" : "block",
        }}
      >
        <label>Дополнительные пакеты правил</label>
        <ActionButton
          mdiIconPath={mdiEye}
          size={1.5}
          action={() => toggleFieldVisibilityForAllLevels("additionalPacks")}
          margin="0 0 0 0.5rem"
        />
        <input
          name={`levels[${index}].additionalPacks`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.additionalPacks}
        />
      </div>
    ),
    customLevelPack: (
      <div
        className="form-group"
        style={{
          display: localHiddenFields.customLevelPack ? "none" : "block",
        }}
      >
        <label>Свой пакет правил</label>
        <ActionButton
          mdiIconPath={mdiEye}
          size={1.5}
          action={() => toggleFieldVisibilityForAllLevels("customLevelPack")}
          margin="0 0 0 0.5rem"
        />
        <input
          name={`levels[${index}].customLevelPack`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.customLevelPack}
        />
      </div>
    ),
    expectedSteps: (
      <div
        className="form-group"
        style={{
          display: localHiddenFields.expectedSteps ? "none" : "block",
        }}
      >
        <label>Ожидаемое число шагов</label>
        <ActionButton
          mdiIconPath={mdiEye}
          size={1.5}
          action={() => toggleFieldVisibilityForAllLevels("expectedSteps")}
          margin="0 0 0 0.5rem"
        />
        <input
          name={`levels[${index}].expectedSteps`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.expectedSteps}
        />
      </div>
    ),
    expectedTime: (
      <div
        className="form-group"
        style={{
          display:
            defaultValue.levelType === LevelType.MANUAL &&
            localHiddenFields.expectedTime
              ? "none"
              : "block",
        }}
      >
        <label>Ожидаемое время</label>
        {defaultValue.levelType === LevelType.MANUAL && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() => toggleFieldVisibilityForAllLevels("expectedTime")}
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].expectedTime`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.expectedTime}
        />
      </div>
    ),
    levelNameEn: (
      <div
        className="form-group"
        style={{
          display: localHiddenFields.levelNameEn ? "none" : "block",
        }}
      >
        <label>Имя на английском</label>
        <ActionButton
          mdiIconPath={mdiEye}
          size={1.5}
          action={() => toggleFieldVisibilityForAllLevels("levelNameEn")}
          margin="0 0 0 0.5rem"
        />
        <input
          name={`levels[${index}].levelNameEn`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.levelNameEn}
        />
      </div>
    ),
    levelNameRu: (
      <div
        className="form-group"
        style={{
          display: localHiddenFields.levelNameRu ? "none" : "block",
        }}
      >
        <label>Имя на русском</label>
        <ActionButton
          mdiIconPath={mdiEye}
          size={1.5}
          action={() => toggleFieldVisibilityForAllLevels("levelNameRu")}
          margin="0 0 0 0.5rem"
        />
        <input
          name={`levels[${index}].levelNameRu`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.levelNameRu}
        />
      </div>
    ),
    levelCode: (
      <div
        className="form-group"
        style={{
          display: localHiddenFields.levelCode ? "none" : "block",
        }}
      >
        <label>Код уровня</label>
        <ActionButton
          mdiIconPath={mdiEye}
          size={1.5}
          action={() => toggleFieldVisibilityForAllLevels("levelCode")}
          margin="0 0 0 0.5rem"
        />
        <input
          name={`levels[${index}].levelCode`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.levelCode}
        />
      </div>
    ),
    autoGeneratedLevelsCount: (
      <div
        className="form-group"
        style={{
          display:
            defaultValue.levelType === LevelType.MANUAL &&
            localHiddenFields.autoGeneratedLevelsCount
              ? "none"
              : "block",
        }}
      >
        <label>Количество автогенерируемых уровней</label>
        {defaultValue.levelType === LevelType.MANUAL && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() =>
              toggleFieldVisibilityForAllLevels("autoGeneratedLevelsCount")
            }
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].autoGeneratedLevelsCount`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.autoGeneratedLevelsCount}
        />
      </div>
    ),
    operations: (
      <div
        className="form-group"
        style={{
          display:
            defaultValue.levelType === LevelType.MANUAL &&
            localHiddenFields.operations
              ? "none"
              : "block",
        }}
      >
        <label>Операции</label>
        {defaultValue.levelType === LevelType.MANUAL && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() => toggleFieldVisibilityForAllLevels("operations")}
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].operations`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.operations}
        />
      </div>
    ),
    stepsCountInterval: (
      <div
        className="form-group"
        style={{
          display:
            defaultValue.levelType === LevelType.MANUAL &&
            localHiddenFields.stepsCountInterval
              ? "none"
              : "block",
        }}
      >
        <label>Интервал шагов</label>
        {defaultValue.levelType === LevelType.MANUAL && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() =>
              toggleFieldVisibilityForAllLevels("stepsCountInterval")
            }
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].stepsCountInterval`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.stepsCountInterval}
        />
      </div>
    ),
    implicitTransformationsCount: (
      <div
        className="form-group"
        style={{
          display:
            defaultValue.levelType === LevelType.MANUAL &&
            localHiddenFields.implicitTransformationsCount
              ? "none"
              : "block",
        }}
      >
        <label>Количество неявных преобразований</label>
        {defaultValue.levelType === LevelType.MANUAL && (
          <ActionButton
            mdiIconPath={mdiEye}
            size={1.5}
            action={() =>
              toggleFieldVisibilityForAllLevels("implicitTransformationsCount")
            }
            margin="0 0 0 0.5rem"
          />
        )}
        <input
          name={`levels[${index}].implicitTransformationsCount`}
          className="form-control"
          type="text"
          ref={register()}
          defaultValue={defaultValue.implicitTransformationsCount}
        />
      </div>
    ),
  };

  const [showAddFields, setShowAddFields] = useState(false);

  const manualLevelBasicInputs = [
    inputs.name,
    inputs.startExpression,
    inputs.goalType,
    inputs.goalDetails,
  ];

  const manualLevelAdditionalInputs = [
    inputs.subjectTypes,
    inputs.additionalPacks,
    inputs.customLevelPack,
    inputs.expectedSteps,
    inputs.expectedTime,
    inputs.levelNameEn,
    inputs.levelNameRu,
    inputs.levelCode,
    inputs.autoGeneratedLevelsCount,
    inputs.operations,
    inputs.stepsCountInterval,
    inputs.implicitTransformationsCount,
  ];

  const autoLevelBasicInputs = [
    inputs.name,
    inputs.operations,
    inputs.subjectTypes,
    inputs.stepsCountInterval,
    inputs.implicitTransformationsCount,
    inputs.autoGeneratedLevelsCount,
  ];

  const autoLevelAdditionalInputs = [
    inputs.expectedTime,
    inputs.startExpression,
    inputs.additionalPacks,
    inputs.customLevelPack,
    inputs.goalType,
    inputs.goalDetails,
    inputs.expectedSteps,
    inputs.levelNameEn,
    inputs.levelNameRu,
    inputs.levelCode,
  ];

  const tableActionButtonsLeft: {
    mdiIconPath: string;
    action: () => any;
    size: number;
  }[] = [
    {
      mdiIconPath: mdiContentCopy,
      size: 1.5,
      action() {
        append({
          ...getValues().levels[index],
          levelType: defaultValue.levelType,
        });
      },
    },
    {
      mdiIconPath: mdiArrowUp,
      size: 1.5,
      action() {
        if (index !== 0) {
          swap(index, index - 1);
        }
      },
    },
    {
      mdiIconPath: mdiArrowDown,
      size: 1.5,
      action() {
        if (index !== getValues().levels.length - 1) {
          swap(index, index + 1);
        }
      },
    },
  ];

  const tableActionButtonsRight: {
    mdiIconPath: string;
    action: () => any;
    size: number;
  }[] = [
    {
      mdiIconPath: mdiClose,
      size: 2,
      action() {
        if (window.confirm(`Вы точно хотите удалить уровень ${index + 1}?`)) {
          remove(index);
        }
      },
    },
    {
      mdiIconPath: mdiFileEye,
      size: 2,
      action() {
        setShowHiddenFieldsModal(true);
      },
    },
    {
      mdiIconPath: mdiPlayCircle,
      size: 2,
      action() {
        updateDemo(index);
      },
    },
  ];

  const listActionButtons: {
    mdiIconPath: string;
    action: () => any;
    size: number;
  }[] = tableActionButtonsLeft.concat(tableActionButtonsRight).map((item) => {
    return { ...item, size: 1.5 };
  });

  return (
    <div
      className={`level-form ${
        visualizationMode === VisualizationMode.TABLE
          ? "level-form--table"
          : "level-form--list"
      }`}
      style={{
        display: `${hidden ? "none" : "flex"}`,
      }}
    >
      {visualizationMode === VisualizationMode.LIST && (
        <div className="level-form__list-action-buttons">
          {listActionButtons.map((button, i) => {
            return <ActionButton key={i} {...button} />;
          })}
        </div>
      )}
      {visualizationMode === VisualizationMode.TABLE &&
        tableActionButtonsLeft.map((button, i) => {
          const { size, action, mdiIconPath } = button;
          return (
            <ActionButton
              key={i}
              mdiIconPath={mdiIconPath}
              size={size}
              action={action}
            />
          );
        })}
      {visualizationMode === VisualizationMode.TABLE && (
        <div className="level-form__level-number">{index + 1}.</div>
      )}
      {defaultValue.levelType === LevelType.AUTO ? (
        <>
          {visualizationMode === VisualizationMode.TABLE && (
            <span className="level-form__level-type-icon">
              <Icon path={mdiRobot} size={2} />
            </span>
          )}
          {autoLevelBasicInputs.map((level: JSX.Element, i: number) => {
            return <div key={i}>{level}</div>;
          })}
          {autoLevelAdditionalInputs.map((level: JSX.Element, i: number) => {
            return (
              <div
                key={i}
                style={{ display: showAddFields ? "block" : "none" }}
              >
                {level}
              </div>
            );
          })}
        </>
      ) : (
        <>
          {visualizationMode === VisualizationMode.TABLE && (
            <span className="level-form__level-type-icon">
              <Icon path={mdiWrench} size={2} />
            </span>
          )}
          {manualLevelBasicInputs.map((level: JSX.Element, i: number) => {
            return <div key={i}>{level}</div>;
          })}
          {manualLevelAdditionalInputs.map((level: JSX.Element, i: number) => {
            return (
              <div
                key={i}
                style={{ display: showAddFields ? "block" : "none" }}
              >
                {level}
              </div>
            );
          })}
        </>
      )}
      {visualizationMode === VisualizationMode.LIST && (
        <ActionButton
          mdiIconPath={showAddFields ? mdiArrowExpandUp : mdiArrowExpandDown}
          size={2}
          action={() => setShowAddFields(!showAddFields)}
        />
      )}
      {visualizationMode === VisualizationMode.TABLE && (
        <>
          <ActionButton
            mdiIconPath={
              showAddFields ? mdiArrowExpandLeft : mdiArrowExpandRight
            }
            size={2}
            action={() => setShowAddFields(!showAddFields)}
          />
          {tableActionButtonsRight.map((button, i) => {
            const { size, mdiIconPath, action } = button;
            return (
              <ActionButton
                key={i}
                mdiIconPath={mdiIconPath}
                size={size}
                action={action}
              />
            );
          })}
        </>
      )}
      <AppModal
        isOpen={showHiddenFieldsModal}
        close={() => setShowHiddenFieldsModal(false)}
      >
        <table className="hidden-levels-fields-table">
          <tr>
            <th>Для всех</th>
            <th>Для уровня {index}</th>
            <th>Поле</th>
          </tr>
          {Object.keys(
            (() =>
              levelType === LevelType.AUTO
                ? allLevelsHiddenFields.autoLevelsHiddenFields
                : allLevelsHiddenFields.manualLevelsHiddenFields)()
          ).map((key: string) => {
            return (
              <tr key={key}>
                <td>
                  <ActionButton
                    mdiIconPath={localHiddenFields[key] ? mdiEyeOff : mdiEye}
                    size={2}
                    action={() => toggleFieldVisibilityForAllLevels(key)}
                    margin="0"
                  />
                </td>
                <td>
                  <ActionButton
                    mdiIconPath={localHiddenFields[key] ? mdiEyeOff : mdiEye}
                    size={2}
                    action={() =>
                      setLocalHiddenFields((prevState: any) => {
                        return {
                          ...prevState,
                          [key]: !prevState[key],
                        };
                      })
                    }
                    margin="0"
                  />
                </td>
                <td>{key}</td>
              </tr>
            );
          })}
        </table>
      </AppModal>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<any, any>({
  allLevelsHiddenFields: selectAllLevelsHiddenFields,
});

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: any) => ({
  toggleFieldVisibilityForAllManualLevels: (fieldName: string) => {
    return dispatch(toggleFieldVisibilityForAllManualLevels(fieldName));
  },
  toggleFieldVisibilityForAllAutoLevels: (fieldName: string) => {
    return dispatch(toggleFieldVisibilityForAllAutoLevels(fieldName));
  },
});

export default connect<StateProps, MapProps, LevelFormProps>(
  mapStateToProps,
  mapDispatchToProps
)(LevelForm);