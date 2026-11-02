interface Component13Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component13 = ({ className, text, variant, hover }: Component13Props) => {
  const variantBodies = {
    "false/6": (
      <>
        {/* Component 13 */}
        <div className={`flex flex-row items-center w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Background */}
          <div className="flex flex-col items-start relative w-fit h-fit bg-color-cyan-61 py-3 px-6">
            {/* Border */}
            <div className="absolute top-[46px] left-[36px] w-5 h-2.5 border" />
            {/* Text */}
            <p className="text-base font-normal text-left text-tw-ring-offset-color leading-normal w-fit h-fit">&#123;text&#125;</p>
          </div>
        </div>
      </>
    ),
    "false/1": (
      <>
        {/* variant=1,:hover=false */}
        <div className={`flex flex-row items-center w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start relative w-fit h-fit py-3 px-6">
            {/* Border */}
            <div className="absolute top-[30px] left-[50px] w-5 h-2.5 border border-color-black-0/0" />
            {/* Text */}
            <p className="text-base font-normal text-left text-color-azure-17 leading-normal w-fit h-fit">&#123;text&#125;</p>
          </div>
        </div>
      </>
    ),
    "false/2": (
      <>
        {/* variant=2,:hover=false */}
        <div className={`flex flex-row items-center w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start relative w-fit h-fit py-3 px-6">
            {/* Border */}
            <div className="absolute top-[30px] left-[50px] w-5 h-2.5 border border-color-black-0/0" />
            {/* Text */}
            <p className="text-base font-normal text-left text-color-azure-17 leading-normal w-fit h-fit">About Us</p>
          </div>
        </div>
      </>
    ),
    "false/3": (
      <>
        {/* variant=3,:hover=false */}
        <div className={`flex flex-row items-center w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start relative w-fit h-fit py-3 px-6">
            {/* Border */}
            <div className="absolute top-[30px] left-[50px] w-5 h-2.5 border border-color-black-0/0" />
            {/* Text */}
            <p className="text-base font-normal text-left text-color-azure-17 leading-normal w-fit h-fit">About Us</p>
          </div>
        </div>
      </>
    ),
    "false/4": (
      <>
        {/* variant=4,:hover=false */}
        <div className={`flex flex-row items-center w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start relative w-fit h-fit py-3 px-6">
            {/* Border */}
            <div className="absolute top-[30px] left-[49px] w-5 h-2.5 border border-color-black-0/0" />
            {/* Text */}
            <p className="text-base font-normal text-left text-color-azure-17 leading-normal w-fit h-fit">About Us</p>
          </div>
        </div>
      </>
    ),
    "false/5": (
      <>
        {/* variant=5,:hover=false */}
        <div className={`flex flex-row items-center w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start relative w-fit h-fit py-3 px-6">
            {/* Border */}
            <div className="absolute top-[30px] left-[49px] w-5 h-2.5 border border-color-black-0/0" />
            {/* Text */}
            <p className="text-base font-normal text-left text-color-azure-17 leading-normal w-fit h-fit">About Us</p>
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/6";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component13;
