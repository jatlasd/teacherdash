import ClassDetails from '@/components/ClassDetails'

function ClassPage({ params }) {
  return <ClassDetails classId={params.id} />
}

export default ClassPage