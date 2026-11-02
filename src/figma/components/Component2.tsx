import Component1 from "./Component1";

interface Component2Props {
  className?: string;
  variant: string;
  hover: string;
}

const Component2 = ({ className, variant, hover }: Component2Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 2 */}
        <div className={`flex flex-row justify-center items-center w-9 h-9 bg-wwwevercarebdcom-athens-gray/80 rounded-full shadow-[0px_3px_20px_0px_rgb(0_33_71_/_0.06)] backdrop-blur-lg hover:rounded-corner-radius-9999 transition ${className ?? ""}`.trim()}>
          {/* Component 1 */}
          <Component1 variant="1" />
        </div>
      </>
    ),
    "false/2": (
      <>
        {/* variant=2,:hover=false */}
        <div className={`flex flex-row justify-center items-center w-9 h-9 bg-wwwevercarebdcom-athens-gray/80 rounded-corner-radius-9999 shadow-[0px_3px_20px_0px_rgb(0_33_71_/_0.06)] backdrop-blur-lg ${className ?? ""}`.trim()}>
          {/* Component 1 */}
          <Component1 variant="2" />
        </div>
      </>
    ),
    "false/3": (
      <>
        {/* variant=3,:hover=false */}
        <div className={`flex flex-row justify-center items-center w-10 h-10 bg-color-white-02/0 rounded-corner-radius-9999 border-2 border-color-chartreuse-green-35 shadow-[0px_3px_20px_0px_rgb(0_33_71_/_0.06)] opacity-50 ${className ?? ""}`.trim()}>
          {/* Component 1 */}
          <Component1 variant="63" />
        </div>
      </>
    ),
    "false/4": (
      <>
        {/* variant=4,:hover=false */}
        <div className={`flex flex-row justify-center items-center w-10 h-10 bg-color-white-02/0 rounded-corner-radius-9999 border-2 border-color-chartreuse-green-35 shadow-[0px_3px_20px_0px_rgb(0_33_71_/_0.06)] ${className ?? ""}`.trim()}>
          {/* Component 1 */}
          <Component1 variant="64" />
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component2;
