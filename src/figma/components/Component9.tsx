// @ts-nocheck -- generated Figma export
interface Component9Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component9 = ({ className, text, variant, hover }: Component9Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 9 */}
        <div className={`flex flex-row justify-center items-center w-40 h-12 bg-wwwevercarebdcom-athens-gray border border-wwwevercarebdcom-prussian-blue shadow-[0px_8px_30px_0px_rgb(0_0_0_/_0.1)] py-2 px-4 overflow-hidden hover:bg-tw-ring-offset-color hover:border-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-center w-fit h-fit">
            {/* Text */}
            <p className="text-sm font-bold text-center text-color-azure-17 leading-normal w-fit h-fit">&#123;text&#125;</p>
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component9;
