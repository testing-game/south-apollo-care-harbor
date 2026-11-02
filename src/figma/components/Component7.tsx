// @ts-nocheck -- generated Figma export
interface Component7Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component7 = ({ className, text, variant, hover }: Component7Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 7 */}
        <div className={`flex flex-row items-start w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-lg font-bold text-left text-color-azure-63 leading-relaxed w-fit h-fit">&#123;text&#125;</p>
        </div>
      </>
    ),
    "false/2": (
      <>
        {/* variant=2,:hover=false */}
        <div className={`flex flex-row items-start w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-base font-bold text-left text-color-azure-63 leading-normal w-fit h-fit">See Package</p>
        </div>
      </>
    ),
    "false/3": (
      <>
        {/* variant=3,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-lg font-bold text-left text-tw-ring-offset-color leading-normal w-fit h-fit">See Package</p>
        </div>
      </>
    ),
    "false/4": (
      <>
        {/* variant=4,:hover=false */}
        <div className={`flex flex-col items-start w-[344px] h-fit ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-base font-normal text-left text-tw-ring-offset-color leading-normal underline w-fit h-fit">See Package</p>
        </div>
      </>
    ),
    "false/5": (
      <>
        {/* variant=5,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-6 ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-base font-normal text-left text-tw-ring-offset-color leading-normal w-fit h-fit">See Package</p>
        </div>
      </>
    ),
    "false/6": (
      <>
        {/* variant=6,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-left text-tw-ring-offset-color leading-[1.43] w-fit h-fit">See Package</p>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component7;
