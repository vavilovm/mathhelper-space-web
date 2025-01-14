// libs and hooks
import React, { Dispatch, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrayField,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
// custom hooks
import useCreationMode from "../hooks/useCreationType";
// redux
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectRulePackJSON } from "../../redux/constructor-jsons/constructor-jsons.selectors";
import { updateRulePackJSON } from "../../redux/constructor-jsons/constructor-jsons.actions";
import CONSTRUCTOR_JSONS_INITIAL_STATE from "../../redux/constructor-jsons/constructor-jsons.state";
// lib components
import { ClipLoader } from "react-spinners";
// custom components
import ActionButton from "../../components/action-button/action-button.component";
import RuleConstructor from "../rule-constructor/rule-constructor.component";
import ConstructorForm from "../../components/constructor-form/constructor-form";
import { ConstructorFormInput } from "../../components/constructor-form/constructor-form.types";
// utils
import { addLastEditedConstructorItemToLocalStorage } from "../../utils/last-edited-constructor-items-local-storage";
import getConstructorSubmitButtonAndTitleText from "../utiils/get-constructor-submit-button-and-title-text";
import RulePackConstructorRequestsHandler from "./rule-pack-constructor.requests-handler";
import NamespaceConstructorRequestHandler from "../namespace-constructor/namespace-constructor.requests-handler";
import RulePackConstructorFormatter from "./rule-pack-constructor.formatter";
import { makeServerRequestErrorMessage, setConstructorValueDueToCreationMode } from "../utils";
import {
  getLastEditedCreationMode,
  getLastExampleConstructorCode,
  setLastEditedCreationMode,
  setLastExampleConstructorCode,
} from "../../utils/local-storage/last-edited-creation-type";
// types
import {
  RulePackConstructorInputs,
  RulePackConstructorReceivedForm,
} from "./rule-pack-constructor.types";
import { RootState } from "../../redux/root-reducer";
import {
  ConstructorJSONType,
  UpdateRulePackJSONAction,
} from "../../redux/constructor-jsons/constructor-jsons.types";
import { ActionButtonProps } from "../../components/action-button/action-button.types";
import { RuleConstructorInputs } from "../rule-constructor/rule-constructor.types";
import { ConstructorCreationMode } from "../common-types";
import { NamespaceReceivedForm } from "../namespace-constructor/namespace-constructor.types";
import { MathInputFormat } from "../../utils/kotlin-lib-functions";
// assets
import Icon from "@mdi/react";
import {
  mdiArrowDown,
  mdiArrowUp,
  mdiClose,
  mdiContentCopy,
  mdiPlus,
} from "@mdi/js";
// styles
import "./rule-pack-constructor.scss";
import { AxiosError } from "axios";
import { SUBJECT_TYPE_OPTIONS } from "../constants/constants";
import AppSpinner from "../../components/app-spinner/app-spinner";

const RulePackConstructor = ({
  rulePackJSON,
  updateRulePackJSON,
}: ConnectedProps<typeof connector>): JSX.Element => {
  // get code from url
  const { code: rulePackCode } = useParams<{ code: any }>();

  // get creation mode using custom hook
  const creationMode: ConstructorCreationMode = useCreationMode();

  // react-hook-form initialization and getting its needed tools
  const reactHookFormFunctions = useForm<RulePackConstructorInputs>({
    mode: "onSubmit",
    shouldUnregister: false,
  });
  const { getValues, control, handleSubmit, reset } = reactHookFormFunctions;

  // react-hook-form's fieldArray initialization and getting its needed tools
  // in order to manage rule constructors
  const { fields, append, swap, remove } = useFieldArray<RuleConstructorInputs>(
    {
      control,
      name: "rules",
    }
  );

  const titleAndSubmitButtonText: string = getConstructorSubmitButtonAndTitleText(
    creationMode,
    ConstructorJSONType.RULE_PACK,
    rulePackCode
  );

  // items to fetch from server
  const [allRulePacks, setAllRulPacks] = useState<string[]>([]);
  const [allNamespaces, setAllNamespaces] = useState<string[]>([]);

  // server response messages
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setSuccessMsg] = useState<null | string>(null);

  const [isRulePackSubmitting, setIsRulePackSubmitting] = useState<boolean>(false);

  // show spinner while fetching
  const [showSpinner, setShowSpinner] = useState<boolean>(
    creationMode !== ConstructorCreationMode.CREATE
  );

  const inputs: ConstructorFormInput[] = [
    {
      name: "namespaceCode",
      label: "Namespace",
      options: allNamespaces.map((ns: string) => ({ label: ns, value: ns })),
      isMulti: false,
      disabled: creationMode === ConstructorCreationMode.EDIT,
      // TODO: вписать значение по умолчанию из local-storage (src/utils/local-storage/last-edited-creation-type.ts); потом подтягивать с сервера
    },
    {
      name: "code",
      label: "Код",
      type: "text",
      disabled: creationMode === ConstructorCreationMode.EDIT,
    },
    {
      name: "nameRu",
      label: "Название Ru",
      type: "text",
    },
    {
      name: "nameEn",
      label: "Название  En",
      type: "text",
    },
    {
      name: "descriptionShortRu",
      label: "Краткое описание Ru",
      type: "text",
    },
    {
      name: "descriptionShortEn",
      label: "Краткое описание En",
      type: "text",
    },
    {
      name: "descriptionRu",
      label: "Описание Ru",
      type: "text",
      isTextArea: true,
    },
    {
      name: "descriptionEn",
      label: "Описание En",
      type: "text",
      isTextArea: true,
    },
    {
      name: "rulePacks",
      label: "Добавить существующие пакеты",
      isMulti: true,
      options: allRulePacks.map((rp: string) => ({ label: rp, value: rp })),
    },
    {
      name: "subjectType",
      label: "Предметная область",
      isMulti: false,
      options: SUBJECT_TYPE_OPTIONS,
    },
    {
      name: `otherCheckSolutionData`,
      label: "Дополнительная информация о проверке решения",
      type: "text",
      isTextArea: true,
    },
    {
      name: `otherAutoGenerationData`,
      label: "Дополнительная информация об автогенерации",
      type: "text",
      isTextArea: true,
    },
    {
      name: `otherData`,
      label: "Дополнительная информация",
      type: "text",
      isTextArea: true,
    },
  ];

  const actionButtons: ActionButtonProps[] = [
    {
      mdiIconPath: mdiContentCopy,
      size: 1.5,
      async action(index: number) {
        // @ts-ignore
        await append(getValues().rules[index]);
        updateRulePackJSON(getValues());
      },
    },
    {
      mdiIconPath: mdiArrowUp,
      size: 1.5,
      async action(index: number) {
        if (index !== 0) {
          await swap(index, index - 1);
          updateRulePackJSON(getValues());
        }
      },
    },
    {
      mdiIconPath: mdiArrowDown,
      size: 1.5,
      async action(index: number) {
        // @ts-ignore
        if (index !== getValues().rules.length - 1) {
          await swap(index, index + 1);
          updateRulePackJSON(getValues());
        }
      },
    },
    {
      mdiIconPath: mdiClose,
      size: 2,
      async action(index: number) {
        if (window.confirm(`Вы точно хотите удалить правило ${index + 1}?`)) {
          await remove(index);
          updateRulePackJSON(getValues());
        }
      },
    },
  ];

  const submitRulePack = (data: RulePackConstructorInputs) => {
    setIsRulePackSubmitting(true);
    RulePackConstructorRequestsHandler.submitOne(
      creationMode,
      RulePackConstructorFormatter.convertConstructorInputsToSendForm(data)
    )
      .then(() => {
        setErrorMsg(null);
        setSuccessMsg(
          creationMode === ConstructorCreationMode.EDIT
            ? "Пакет правил успешно изменен!"
            : "Пакет правил успешно создан!"
        );
        addLastEditedConstructorItemToLocalStorage(
          "last-edited-rule-packs",
          {
            code: data.code,
            nameEn: data.nameEn,
          },
        );
        setIsRulePackSubmitting(false);
      })
      .catch((e: AxiosError) => {
        setSuccessMsg(null);
        setErrorMsg(makeServerRequestErrorMessage(e));
      });
  };

  // fetching all necessary entities
  useEffect(() => {
    // get all rulePacks for links
    NamespaceConstructorRequestHandler.getAll().then(
      (res: NamespaceReceivedForm[]) =>
        setAllNamespaces(res.map((ns: NamespaceReceivedForm) => ns.code))
    );
    RulePackConstructorRequestsHandler.getAll().then(
      (res: RulePackConstructorReceivedForm[]) =>
        setAllRulPacks(
          res.map((rp: RulePackConstructorReceivedForm) => rp.code)
        )
    );
  }, []);

  // set values due to creation mode and relevant constructor state
  useEffect(() => {
    setConstructorValueDueToCreationMode(
      ConstructorJSONType.RULE_PACK,
      creationMode,
      getLastEditedCreationMode(ConstructorJSONType.RULE_PACK),
      reset,
      CONSTRUCTOR_JSONS_INITIAL_STATE.rulePack,
      setLastEditedCreationMode,
      rulePackJSON,
      updateRulePackJSON,
      rulePackCode,
      async () => {
        const res = await RulePackConstructorRequestsHandler.getOne(
          rulePackCode
        );
        return RulePackConstructorFormatter.convertReceivedFormToConstructorInputs(
          res
        );
      },
      getLastExampleConstructorCode(ConstructorJSONType.RULE_PACK),
      rulePackCode,
      setLastExampleConstructorCode
    ).then(() => {
      setShowSpinner(false);
    });
  }, []);

  if (showSpinner) {
    return (
      <div style={{ margin: "2rem" }}>
        <ClipLoader loading={showSpinner} />
      </div>
    );
  } else {
    return (
      <FormProvider {...reactHookFormFunctions}>
        <form
          onSubmit={handleSubmit(() => {
            submitRulePack(getValues());
          })}
          className="rule-pack-constructor"
        >
          <h2>{titleAndSubmitButtonText}</h2>
          <ConstructorForm
            inputs={inputs}
            constructorType={ConstructorJSONType.RULE_PACK}
          />
          <h3>Правила:</h3>
          <div className="rule-pack-constructor__rules">
            {fields.map(
              (
                field: Partial<ArrayField<RuleConstructorInputs, "id">>,
                fieldIdx: number
              ) => {
                return (
                  <div className="rule-pack-constructor__rule" key={fieldIdx}>
                    <b>{fieldIdx + 1}.</b>
                    <div className="rule-pack-constructor__action-buttons">
                      {actionButtons.map(
                        (button: ActionButtonProps, buttonIdx: number) => {
                          return (
                            <ActionButton
                              key={buttonIdx}
                              mdiIconPath={button.mdiIconPath}
                              size={1.5}
                              action={() => {
                                button.action(fieldIdx);
                              }}
                              margin="0 1rem 0 0"
                            />
                          );
                        }
                      )}
                    </div>
                    <RuleConstructor
                      key={field.id}
                      index={fieldIdx}
                      defaultValue={fields[fieldIdx]}
                    />
                  </div>
                );
              }
            )}
            <div className="rule-pack-constructor__action-buttons">
              <button
                type="button"
                className="btn u-mr-sm"
                onClick={async () => {
                  await append(
                    // @ts-ignore
                    CONSTRUCTOR_JSONS_INITIAL_STATE.rulePack.rules[0]
                  );
                  updateRulePackJSON(getValues());
                }}
              >
                <Icon path={mdiPlus} size={1.2} />
                <span>правило</span>
              </button>
            </div>
          </div>
          {/*server response messages*/}
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success" role="alert">
              {successMsg}
            </div>
          )}
          {isRulePackSubmitting && <AppSpinner loading={isRulePackSubmitting} />}
          <button type="submit" className="btn u-mt-sm">
            {titleAndSubmitButtonText}
          </button>
          <button
            type="button"
            className="btn u-mt-sm"
            onClick={() => console.log(getValues())}
          >
            log values
          </button>
        </form>
      </FormProvider>
    );
  }
};

// connecting redux props
const mapState = createStructuredSelector<
  RootState,
  {
    rulePackJSON: RulePackConstructorInputs;
  }
>({
  rulePackJSON: selectRulePackJSON,
});

const mapDispatch = (dispatch: Dispatch<UpdateRulePackJSONAction>) => ({
  updateRulePackJSON: (rulePackJSON: RulePackConstructorInputs) =>
    dispatch(updateRulePackJSON(rulePackJSON)),
});

const connector = connect(mapState, mapDispatch);

export default connector(RulePackConstructor);
