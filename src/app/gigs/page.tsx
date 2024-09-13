import React from "react";
import GigCard from "./_components/GigCard";

const GigsPage = () => {
  return (
    <div className="container mx-auto p-10 flex flex-col items-center gap-4">
      <GigCard />
      <GigCard />
      <GigCard />
      <GigCard />
    </div>
  );
};

export default GigsPage;
