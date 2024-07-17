"use client";

import { classNames } from "lib/utils";
import { useState } from "react";

export default function WorkshopsList({ workshops }) {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
      <h2 className="font-accent text-base uppercase tracking-wider text-tfm-secondary">
        Your first year
      </h2>
      <div className="mb-12 mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 lg:grid-cols-4">
        {workshops.map((workshop, index) => (
          <div key={index} className="space-y-4 text-center">
            <div
              className={classNames(
                "relative cursor-pointer overflow-hidden rounded bg-white shadow-lg transition-all duration-500 ease-in-out",
                selectedWorkshop === index ? "bg-gray-100" : ""
              )}
              onMouseEnter={() => setSelectedWorkshop(index)}
              onMouseLeave={() => setSelectedWorkshop(null)}
              onClick={() => setSelectedWorkshop(index)}
            >
              <img
                className="h-48 w-full object-cover transition-transform duration-500 ease-in-out"
                src={workshop.img}
                alt={workshop.imgAlt}
              />
              {selectedWorkshop === index && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-tfm-primary bg-opacity-75 p-4 opacity-100 transition-opacity duration-500 ease-in-out">
                  <p className="mt-2 font-medium text-white">
                    {workshop.description}
                  </p>
                </div>
              )}
            </div>
            <h3 className="font-brand text-3xl text-tfm-primary-500">
              {workshop.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
