interface Component8Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component8 = ({ className, text, variant, hover }: Component8Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 8 */}
        <div className={`flex flex-row justify-center items-center relative w-fit h-12 bg-wwwevercarebdcom-wisteria pt-2 pr-[52px] pb-2 pl-[52px] overflow-hidden hover:bg-wwwevercarebdcom-amethyst transition ${className ?? ""}`.trim()}>
          {/* Gradient */}
          <div className="absolute w-[225px] h-12 bg-gradient-to-r from-wwwevercarebdcom-athens-gray/0 to-wwwevercarebdcom-athens-gray/0 via-wwwevercarebdcom-athens-gray/0" />
          {/* Container */}
          <div className="flex flex-col items-center w-fit h-fit">
            {/* Text */}
            <p className="text-sm font-bold text-center text-tw-ring-offset-color leading-normal w-fit h-fit">&#123;text&#125;</p>
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component8;
