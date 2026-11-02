// @ts-nocheck -- generated Figma export
import Component1 from "./Component1";

interface Component11Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component11 = ({ className, text, variant, hover }: Component11Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 11 */}
        <div className={`flex flex-row gap-stroke-weight-4 items-center w-fit h-8 bg-wwwevercarebdcom-royal-blue rounded-[18px] px-4 hover:bg-wwwevercarebdcom-denim transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start w-[18px] h-[18px]">
            {/* Component 1 */}
            <Component1 variant="69" />
          </div>
          {/* Text */}
          <p className="text-sm font-normal text-left text-tw-ring-offset-color w-fit h-fit">&#123;text&#125;</p>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component11;
