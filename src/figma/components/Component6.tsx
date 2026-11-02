// @ts-nocheck -- generated Figma export
interface Component6Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component6 = ({ className, text, variant, hover }: Component6Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 6 */}
        <div className={`flex flex-row justify-center items-center relative w-fit h-12 bg-wwwevercarebdcom-wisteria pt-3.5 pr-[37px] pb-3.5 pl-[37px] overflow-hidden hover:bg-wwwevercarebdcom-amethyst transition ${className ?? ""}`.trim()}>
          {/* Gradient */}
          <div className="absolute w-[209px] h-12 bg-gradient-to-r from-wwwevercarebdcom-athens-gray/0 to-wwwevercarebdcom-athens-gray/0 via-wwwevercarebdcom-athens-gray/0" />
          {/* Text */}
          <p className="text-sm font-bold text-center text-tw-ring-offset-color leading-normal w-fit h-fit">&#123;text&#125;</p>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component6;
