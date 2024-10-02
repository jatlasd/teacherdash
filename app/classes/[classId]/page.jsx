import WholeClassDetails from "@/components/my-classes/WholeClassDetails";
import React from "react";

const ClassPage = ({ params }) => {
  const { classId } = params;
  return <WholeClassDetails classId={classId} />;
};

export default ClassPage;
