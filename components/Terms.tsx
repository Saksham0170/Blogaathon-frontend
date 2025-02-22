import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 lg:pt-14 bg-gradient-to-r from-[rgba(63,97,173,0.24)] via-[rgba(168,76,156,0.24)] to-[rgba(238,54,77,0.24)] px-4 lg:px-0 pb-10 lg:pb-24">
      <div className="text-center max-w-6xl">
        <h1 className="text-[#28456F] font-bold font-['Segoe_UI'] text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[122.502%]">
          Terms and Conditions
        </h1>
        <div className="lists pt-8 sm:pt-10 px-4 sm:px-8 lg:p">
          <ul className="text-[#3C3C41] font-['Segoe_UI'] text-sm sm:text-base md:text-[14px]   leading-relaxed md:leading-[123%] mt-4 text-left list-disc space-y-5 font-normal">
            <li>Winners of previous phases cannot participate/submit blogs in the upcoming phases.</li>
            <li>One participant is eligible to make ONE blog submission only. More than one blog submission will be disqualified.</li>
            <li>The participant/winner/content shall be disqualified:
              <ul className="list-none  sm:pl-0 lg:pt-1 space-y-1">
                <li>- if the submission is after 26th December 2024.</li>
                <li>- if substantial or full content of the submission is a re-publication of content written earlier.</li>
                <li>- if any or significant parts of the content is plagiarised.</li>
                <li>- if the same submission is made under multiple categories or if the content does not fall under any of the categories covered in this contest.</li>
              </ul>
            </li>
            <li>Microsoft Azure reserves the right to change the prize details without notice.</li>
            <li>The prizes are subject to availability with transport/courier services available and allowed.</li>
            <li>Unless otherwise stated, all taxes, insurance, fees and surcharges on any prize are the sole responsibility of the winner; any applicable Tax Deduction at Source (TDS) or other applicable statutory charges will be applied on the prizes as per the prevailing laws in India.</li>
            <li>Prizes are non-transferable and will only be awarded to the winner.</li>
            <li>The winners will be contacted directly by email or phone.</li>
            <li>In case of any disputes on the selection of the winners or on the submitted content of the developer blog, the decision by Microsoft Azure and the review panel shall be considered absolute; no further correspondence shall be considered in that regard.</li>
            <li>You give Microsoft permission to publish and share the content on the Microsoft online resources, newsletters, social media and other platforms (you will still own all the rights to your submission).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
