import RotationsContainer from "@/components/rotations/RotationsContainer";

const Rotations = () => {
  return (
    <div className="container mx-auto p-6 flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Rotations</h1>
        <p className="text-lg text-gray-600">
          Display and manage group rotations for your class activities
        </p>
      </div>
      <div className="space-y-6">
        <RotationsContainer />
      </div>
    </div>
  );
};

export default Rotations;
