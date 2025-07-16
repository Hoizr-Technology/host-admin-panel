import Image from "next/image";
import React from "react";

interface AuthScreenSectionProps {
  title?: string;
  description: string;
  imageUrl: string;
  backgroundColor?: string;
  descriptionTextColor?: string;
}

const AuthScreenSection: React.FC<AuthScreenSectionProps> = ({
  title,
  description,
  imageUrl,
  backgroundColor = "#0f172a",
  descriptionTextColor = "text-white",
}) => {
  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={index < count ? "text-yellow-400" : "text-gray-400"}
        >
          ★
        </span>
      ));
  };

  return (
    <div
      className="hidden lg:block relative h-screen w-full"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col h-full p-8 space-y-8">
        <div className="mt-5">
          {/* <h2
            className={`text-2xl font-semibold ${titleTextColor} leading-tight`}
          >
            {title}
          </h2> */}
          <p className={`max-w-full mt-4 text-2xl text-black leading-relaxed`}>
            {description}
          </p>
        </div>

        <div className="w-full h-full relative">
          <Image
            src={imageUrl}
            alt="Hoizr Artist Panel"
            fill
            className="w-full h-full rounded-lg object-cover object-left"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthScreenSection;
