// @ts-nocheck -- generated Figma export
import vt19Asset from "../assets/vt-19.png.asset.json";
const vt19 = vt19Asset.url;

interface Component10Props {
  className?: string;
  variant: string;
  hover: string;
}

const Component10 = ({ className, variant, hover }: Component10Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 10 */}
        <div className={`flex flex-row items-start w-fit h-fit bg-wwwevercarebdcom-athens-gray rounded-sm border-2 border-wwwevercarebdcom-athens-gray shadow-[0px_2px_6px_0px_rgb(0_0_0_/_0.3)] overflow-hidden hover:bg-tw-ring-offset-color hover:rounded-corner-radius-3 hover:border-4 hover:border-tw-ring-offset-color transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="relative w-[38px] h-[38px] overflow-hidden">
            {/* Background */}
            <div className="absolute w-[38px] h-[38px] bg-color-orange-89">
              {/* Region - Map */}
              <div className="absolute top-[-205px] left-[-188px] flex flex-col items-center w-64 h-64">
                {/* vt */}
                <img className="w-64 h-64" src={vt19} alt="vt" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component10;
