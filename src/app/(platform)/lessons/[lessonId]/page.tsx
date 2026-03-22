import LessonDetailPageFeature from "@/features/lessons/pages/lesson-detail-page";

export default async function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonDetailPageFeature lessonId={lessonId} />;
}
