import Component1 from "./Component1";

interface Component14Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component14 = ({ className, text, variant, hover }: Component14Props) => {
  const variantBodies = {
    "false/2": (
      <>
        {/* Component 14 */}
        <div className={`relative w-[141px] h-12 hover:bg-color-cyan-61 transition ${className ?? ""}`.trim()}>
          {/* Border */}
          <div className="absolute top-[30px] left-[60px] w-5 h-2.5 border border-color-black-0/0" />
          {/* Text */}
          <p className="absolute top-[12px] left-[15px] text-base font-normal text-center text-color-azure-17 leading-normal">&#123;text&#125;</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[17px] left-[109px]" variant="83" />
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/2";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component14;
