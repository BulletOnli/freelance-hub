import React from "react";

type Props = {
  params: { gigId: string };
};

const GigDetailsPage = ({ params }: Props) => {
  return <div>Gig details of {params.gigId}</div>;
};

export default GigDetailsPage;
