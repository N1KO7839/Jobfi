import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { MapPin, Briefcase, Clock } from "lucide-react";
import Link from "next/link";

import { JobOffer } from "@/types/offers";

interface OfferCardProps {
  offer: JobOffer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <Card
      as={Link}
      className="w-full bg-slate-500/17.5 border border-white/5 hover:bg-slate-500/22.5 transition-colors shadow-none cursor-pointer rounded-2xl"
      href={offer.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <CardHeader className="flex justify-between items-start pt-5 px-5 pb-2">
        <div className="flex flex-col gap-1.5">
          <p className="text-[17px] font-semibold text-default-900 leading-tight">
            {offer.title}
          </p>
          <p className="text-[15px] text-default-500">{offer.company}</p>
        </div>
      </CardHeader>

      <CardBody className="px-5 pb-5 pt-2 flex flex-col gap-5">
        {offer.salary && offer.salary !== "null" && (
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2A1D45] text-[#D0B5FA] text-[15px] font-semibold">
              {offer.salary} {offer.currency}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-5 text-[14px] text-default-500 font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="opacity-80" size={16} />
            <span>{offer.location || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="opacity-80" size={16} />
            <span>{offer.working_mode || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="opacity-80" size={16} />
            <span>{new Date(offer.created_datetime).toLocaleDateString()}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
