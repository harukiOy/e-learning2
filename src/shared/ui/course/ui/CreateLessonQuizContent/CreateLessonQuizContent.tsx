import {type FC, useEffect} from "react";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {trpc} from "@/shared/utils/trpc";
import {Button} from "@/shared/ui";
import {ButtonThemes} from "@/shared/ui/Button/Button";
import {v4 as uuidv4} from "uuid";
import QuestionAnswerForm from "@/shared/ui/course/ui/CourseQuizForms/QuestionAnswerForm";
import QuestionAnswerFormWithFixedLettersAnswer
    from "@/shared/ui/course/ui/CourseQuizForms/QuestionAnswerFormWithFixedLettersAnswer";
import {QuizBlocks, QuizContentType} from "@/enteties/Lesson";
import {AiOutlineClose} from "react-icons/ai";


export type FormData = {
    blocks: QuizBlocks[];
};

type Props = {
    lessonId: string;
    initialData: QuizBlocks[];
    setQuizContentEditable: () => void
    setIsSuccessVisible: (id: string, visible: boolean, isSuccess: boolean, error?: string) => void
};

const CreateLessonQuizContent: FC<Props> = ({initialData, setQuizContentEditable, setIsSuccessVisible, lessonId}) => {
    const utils = trpc.useContext();
    const lessonUpdateContentQuery = trpc.lesson.updateContent.useMutation({
        async onSuccess() {
            await utils.lesson.byId.invalidate();
        }
    });

    const methods = useForm<FormData>({
        defaultValues: {blocks: initialData || []},
    });
    const {handleSubmit, reset} = methods;

    useEffect(() => {
        reset({blocks: initialData || []});
    }, [initialData, reset]);

    const onSubmit = (data: FormData) => {
        try {
            lessonUpdateContentQuery.mutate({
                id: lessonId,
                lesson_content: {...data},
            });
        } catch (e) {
            console.log(e);
        } finally {
            setQuizContentEditable();
            setIsSuccessVisible(lessonId, true, true);

        }
    };

    const {append, fields, remove} = useFieldArray({
        control: methods.control,
        name: "blocks",
    });

    const addAnswerWithFixedLetters = () => {
        append({
            id: uuidv4(),
            type: QuizContentType.ANSWER_WITH_FIXED_LETTERS,
            question: "",
            answer: "",
        });
    };

    const addQuestionAnswerBlock = () => {
        append({
            id: uuidv4(),
            type: QuizContentType.QUESTION_ANSWER,
            question: "",
            correctAnswer: "",
            answer: [
                {
                    otherAnswer: "",
                },
            ],
        });
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={"flex flex-col gap-2 "}
            >
                {fields.map((field, index) => (
                    <div key={field.id}>
                        {field.type === QuizContentType.QUESTION_ANSWER ? (
                            <div
                                className={"flex gap-2 items-start bg-light-neutral-900/60  dark:bg-neutral-600/30 rounded-xl px-5 py-5"}>
                                <QuestionAnswerForm index={index}/>
                                <Button
                                    theme={ButtonThemes.TEXT}
                                    className={"!p-2 !rounded-md"}
                                    type="button"
                                    onClick={() => {
                                        remove(index);
                                    }}
                                >
                                    <AiOutlineClose/>
                                </Button>
                            </div>
                        ) : field.type === QuizContentType.ANSWER_WITH_FIXED_LETTERS ? (
                            <div
                                className={"flex gap-2 items-start bg-light-neutral-900/60  dark:bg-neutral-600/30 rounded-xl px-5 py-5"}>
                                <QuestionAnswerFormWithFixedLettersAnswer index={index}/>
                                <Button
                                    theme={ButtonThemes.TEXT}
                                    className={"!p-2 !rounded-md"}
                                    type="button"
                                    onClick={() => {
                                        remove(index);
                                    }}
                                >
                                    <AiOutlineClose/>
                                </Button>
                            </div>
                        ) : null}
                    </div>
                ))}
                <div
                    className={"grid grid-cols-1 gap-2 md:grid-cols-4 mt-5 sm:mt-0 bg-neutral-600/30 p-5 md:p-2 rounded-md"}>
                    <Button theme={ButtonThemes.FILLED} onClick={addQuestionAnswerBlock}>
                        Add Question Answer
                    </Button>
                    <Button
                        theme={ButtonThemes.FILLED}
                        onClick={addAnswerWithFixedLetters}
                    >
                        Add Answer with fixed letters
                    </Button>
                </div>
                <div className={"flex justify-end "}>
                    <Button theme={ButtonThemes.FILLED} type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default CreateLessonQuizContent;
