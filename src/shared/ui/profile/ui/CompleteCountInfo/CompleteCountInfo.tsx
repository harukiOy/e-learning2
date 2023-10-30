import {FC} from "react";
import {trpc} from "@/shared/utils/trpc";
import {Loader} from "@/shared/ui";

interface Props {
    user_id: string
}

const CompleteCountInfo: FC<Props> = ({user_id}) => {

    const counts = trpc.progress.getCompleteCount.useQuery({id: user_id});

    if (counts.isLoading) {
        return <Loader />;
    }

    return (
        <div className={"flex flex-col items-center justify-center gap-10 p-5 min-w-[200px] max-w-[340px] h-[310px] border-2 border-dark-primary-main rounded-md"}>
            <div className={"flex items-center"}>
                <span className={"text-2xl sm:text-4xl mr-3 text-dark-primary-main"}>{counts.data?.courses_progress_length}</span>
                <p className={"text-xl"}>Completed Courses</p>
            </div>
            <div className={"flex items-center"}>
                <span className={"text-2xl sm:text-4xl mr-3 text-dark-primary-main"}>{counts.data?.modules_progress_length}</span>
                <p className={"text-xl"}>Completed Modules</p>
            </div>
            <div className={"flex items-center"}>
                <span className={"text-2xl sm:text-4xl mr-3 text-dark-primary-main"}>{counts.data?.lessons_progress_length}</span>
                <p className={"text-xl"}>Completed Lessons</p>
            </div>
        </div>
    );
};

export default CompleteCountInfo;