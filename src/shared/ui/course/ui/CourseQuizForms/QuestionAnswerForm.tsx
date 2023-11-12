import {type FC} from "react";
import {useFieldArray, useFormContext} from "react-hook-form";
import {Button, ButtonThemes, Label} from "@/shared/ui";

type Props = {
    index: number;
};

const QuestionAnswerForm: FC<Props> = ({index}) => {
    const {register, control} = useFormContext();
    const {
        fields,
        remove,
        append: appendAnswer,
    } = useFieldArray({
        control,
        name: `blocks.${index}.answer`,
    });

    const appendIncorrectAnswer = () => {
        appendAnswer({otherAnswer: ""});
    };

    return (
        <div className={"flex flex-col gap-5 w-full"}>
            <h5 className={"text-2xl w-full font-bold text-blue-400"}>{index + 1}. Question Answer Block</h5>
            <Label htmlFor={`blocks.${index}.question`} labelText={"Question"}
                textColor={"!text-dark-primary-main"}
            >
                <input
                    className={"inputField"}
                    {...register(`blocks.${index}.question`, {
                        required: {value: true, message: "Question is required"},
                        minLength: {value: 1, message: "Min length is 1 letter"},
                    })}
                />
            </Label>
            <Label
                htmlFor={`blocks.${index}.correctAnswer`}
                labelText={"CorrectAnswer"}
                textColor={"!text-green-400"}
            >
                <input
                    className={"inputField !border-green-400 "}
                    {...register(`blocks.${index}.correctAnswer`, {
                        required: {value: true, message: "Correct Answer is required"},
                        minLength: {value: 1, message: "Min length is 1 letter"},
                    })}
                />
            </Label>
            {fields.map((field, otherAnswerIndex) => (
                <div key={field.id} className={"flex gap-2 items-start"}>
                    <div className={"w-full"}>
                        <Label
                            htmlFor={`blocks.${index}.answer.${otherAnswerIndex}.otherAnswer`}
                            labelText={"Incorrect Answer"}
                            textColor={"!text-red-400"}
                        >
                            <input
                                className={"inputField w-full !border-red-400"}
                                {...register(
                                    `blocks.${index}.answer.${otherAnswerIndex}.otherAnswer`, {
                                        required: {value: true, message: "Incorrect Answer is required"},
                                        minLength: {value: 1, message: "Min length is 1 letter"},
                                    }
                                )}
                            />
                        </Label>
                    </div>
                    <Button
                        theme={ButtonThemes.TEXT}
                        type='button'
                        className={"!px-2 !py-0 rounded-md"}
                        onClick={() => {
                            remove(otherAnswerIndex);
                        }}
                    >
                        x
                    </Button>
                </div>
            ))}
            <Button
                type={"button"}
                theme={ButtonThemes.FILLED}
                onClick={appendIncorrectAnswer}
            >
                Add Answer
            </Button>
        </div>
    );
};

export default QuestionAnswerForm;
