"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Contract = {
  id: string;
  gigId: string;
  freelancerId: string;
  clientId: string;
  status: string;
  price: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
  freelancer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
};

const PdfContract = ({ contract }: { contract: Contract }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    const html2pdf = await require("html2pdf.js");
    const element = document.getElementById("gig-contract");

    html2pdf(element, {
      margin: 5,
      filename: `Gig Contract - ${contract.id}.pdf`,
      jsPDF: { format: [150, 150], orientation: "portrait" },
    });

    setIsGeneratingPDF(false);
  };

  return (
    <Button onClick={generatePDF} disabled={isGeneratingPDF}>
      {isGeneratingPDF ? (
        "Generating..."
      ) : (
        <>
          <Download className="mr-2 size-5" color="white" />
          Download PDF
        </>
      )}
    </Button>
  );
};

export default PdfContract;
