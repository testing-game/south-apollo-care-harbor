import Component1 from "./Component1";

interface Component12Props {
  className?: string;
  variant: string;
  hover: string;
}

const Component12 = ({ className, variant, hover }: Component12Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 12 */}
        <div className={`flex flex-row justify-center items-center w-8 h-8 bg-wwwevercarebdcom-athens-gray rounded-2xl hover:bg-wwwevercarebdcom-mystic transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-col items-start w-[18px] h-[18px]">
            {/* Component 1 */}
            <Component1 variant="70" />
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component12;
