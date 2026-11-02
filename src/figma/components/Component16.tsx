interface Component16Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component16 = ({ className, text, variant, hover }: Component16Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 16 */}
        <div className={`flex flex-row justify-center items-center relative w-40 h-12 bg-wwwevercarebdcom-prussian-blue py-2 px-4 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Button:shadow */}
          <div className="absolute w-40 h-12 bg-color-white-02/0 shadow-[0px_1px_2px_-1px_rgb(0_0_0_/_0.1),_0px_1px_3px_0px_rgb(0_0_0_/_0.1)]" />
          {/* Container */}
          <div className="flex flex-col items-center w-fit h-fit">
            {/* Text */}
            <p className="text-sm font-medium text-center text-color-grey-98 leading-normal w-fit h-fit">&#123;text&#125;</p>
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component16;
