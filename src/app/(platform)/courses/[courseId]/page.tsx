import { CourseDetailPage } from "@/features/courses/pages/course-detail-page";

export default async function CourseDetailRoutePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseDetailPage courseId={courseId} />;
}
