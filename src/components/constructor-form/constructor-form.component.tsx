import React from "react";
import { ConstructorInputProps } from "../constructor-input/construcor-input.types";
import { ConstructorSelectProps } from "../constructor-select/constructor-select.types";
import { isSelectInput } from "../../constructors/utils";
import ConstructorSelect from "../constructor-select/constructor-select.component";
import ConstructorInput from "../constructor-input/constructor-input.component";

interface ConstructorFormProps {
  inputs: (ConstructorInputProps | ConstructorSelectProps)[];
  register: () => void;
  control?: any;
  onBlur?: () => void;
}

const ConstructorForm = ({
  inputs,
  register,
  control,
  onBlur,
}: ConstructorFormProps): JSX.Element => {
  return (
    <>
      {inputs.map(
        (
          input: ConstructorInputProps | ConstructorSelectProps
        ): JSX.Element => {
          const { name } = input;
          if (isSelectInput(input)) {
            return (
              <ConstructorSelect
                key={name}
                register={register}
                control={control}
                onBlur={onBlur}
                {...input}
              />
            );
          } else {
            return (
              <ConstructorInput
                key={name}
                register={register}
                onBlur={onBlur}
                {...input}
              />
            );
          }
        }
      )}
    </>
  );
};

export default ConstructorForm;
