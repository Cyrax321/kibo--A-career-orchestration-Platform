import { AppLayout } from "@/components/layout/AppLayout";
import { CourseViewer } from "@/components/learning/CourseViewer";
import { pythonCourse } from "@/data/pythonCourse";

const Learning = () => {
    return (
        <AppLayout>
            <CourseViewer course={pythonCourse} />
        </AppLayout>
    );
};

export default Learning;
