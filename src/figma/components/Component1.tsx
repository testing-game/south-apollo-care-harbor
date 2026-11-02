import component1Asset from "../assets/component-1.png.asset.json";
const component1 = component1Asset.url;
import variant2Asset from "../assets/variant2.png.asset.json";
const variant2 = variant2Asset.url;
import variant6Asset from "../assets/variant6.png.asset.json";
const variant6 = variant6Asset.url;
import variant10Asset from "../assets/variant10.png.asset.json";
const variant10 = variant10Asset.url;
import variant14Asset from "../assets/variant14.png.asset.json";
const variant14 = variant14Asset.url;
import variant18Asset from "../assets/variant18.png.asset.json";
const variant18 = variant18Asset.url;
import variant22Asset from "../assets/variant22.png.asset.json";
const variant22 = variant22Asset.url;
import variant26Asset from "../assets/variant26.png.asset.json";
const variant26 = variant26Asset.url;
import variant30Asset from "../assets/variant30.png.asset.json";
const variant30 = variant30Asset.url;
import variant34Asset from "../assets/variant34.png.asset.json";
const variant34 = variant34Asset.url;
import variant38Asset from "../assets/variant38.png.asset.json";
const variant38 = variant38Asset.url;
import dentishChairAsset from "../assets/dentish-chair.png.asset.json";
const dentishChair = dentishChairAsset.url;
import variant46Asset from "../assets/variant46.png.asset.json";
const variant46 = variant46Asset.url;
import variant50Asset from "../assets/variant50.png.asset.json";
const variant50 = variant50Asset.url;
import variant54Asset from "../assets/variant54.png.asset.json";
const variant54 = variant54Asset.url;
import variant58Asset from "../assets/variant58.png.asset.json";
const variant58 = variant58Asset.url;
import variant62Asset from "../assets/variant62.png.asset.json";
const variant62 = variant62Asset.url;
import variant63Asset from "../assets/variant63.png.asset.json";
const variant63 = variant63Asset.url;
import variant64Asset from "../assets/variant64.png.asset.json";
const variant64 = variant64Asset.url;
import variant65Asset from "../assets/variant65.png.asset.json";
const variant65 = variant65Asset.url;
import variant66Asset from "../assets/variant66.png.asset.json";
const variant66 = variant66Asset.url;
import variant67Asset from "../assets/variant67.png.asset.json";
const variant67 = variant67Asset.url;
import groupAsset from "../assets/group.png.asset.json";
const group = groupAsset.url;
import vectorAsset from "../assets/vector.svg.asset.json";
const vector = vectorAsset.url;
import vector2Asset from "../assets/vector-2.svg.asset.json";
const vector2 = vector2Asset.url;
import vector3Asset from "../assets/vector-3.svg.asset.json";
const vector3 = vector3Asset.url;
import vector4Asset from "../assets/vector-4.svg.asset.json";
const vector4 = vector4Asset.url;
import vector5Asset from "../assets/vector-5.svg.asset.json";
const vector5 = vector5Asset.url;
import vector6Asset from "../assets/vector-6.svg.asset.json";
const vector6 = vector6Asset.url;
import variant69Asset from "../assets/variant69.png.asset.json";
const variant69 = variant69Asset.url;
import variant70Asset from "../assets/variant70.png.asset.json";
const variant70 = variant70Asset.url;
import variant71Asset from "../assets/variant71.png.asset.json";
const variant71 = variant71Asset.url;
import variant72Asset from "../assets/variant72.png.asset.json";
const variant72 = variant72Asset.url;
import variant73Asset from "../assets/variant73.png.asset.json";
const variant73 = variant73Asset.url;
import variant74Asset from "../assets/variant74.png.asset.json";
const variant74 = variant74Asset.url;
import variant75Asset from "../assets/variant75.png.asset.json";
const variant75 = variant75Asset.url;
import variant76Asset from "../assets/variant76.png.asset.json";
const variant76 = variant76Asset.url;
import variant77Asset from "../assets/variant77.png.asset.json";
const variant77 = variant77Asset.url;
import variant78Asset from "../assets/variant78.png.asset.json";
const variant78 = variant78Asset.url;
import variant79Asset from "../assets/variant79.png.asset.json";
const variant79 = variant79Asset.url;
import variant80Asset from "../assets/variant80.png.asset.json";
const variant80 = variant80Asset.url;
import variant81Asset from "../assets/variant81.png.asset.json";
const variant81 = variant81Asset.url;
import variant83Asset from "../assets/variant83.png.asset.json";
const variant83 = variant83Asset.url;

interface Component1Props {
  className?: string;
  variant: string;
}

const Component1 = ({ className, variant }: Component1Props) => {
  const variantBodies = {
    "1": (
      <>
        {/* Component 1 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={component1} alt="Component 1" />
      </>
    ),
    "2": (
      <>
        {/* variant=2 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant2} alt="variant=2" />
      </>
    ),
    "6": (
      <>
        {/* variant=6 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant6} alt="variant=6" />
      </>
    ),
    "10": (
      <>
        {/* variant=10 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant10} alt="variant=10" />
      </>
    ),
    "14": (
      <>
        {/* variant=14 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant14} alt="variant=14" />
      </>
    ),
    "18": (
      <>
        {/* variant=18 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant18} alt="variant=18" />
      </>
    ),
    "22": (
      <>
        {/* variant=22 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant22} alt="variant=22" />
      </>
    ),
    "26": (
      <>
        {/* variant=26 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant26} alt="variant=26" />
      </>
    ),
    "30": (
      <>
        {/* variant=30 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant30} alt="variant=30" />
      </>
    ),
    "34": (
      <>
        {/* variant=34 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant34} alt="variant=34" />
      </>
    ),
    "38": (
      <>
        {/* variant=38 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant38} alt="variant=38" />
      </>
    ),
    "42": (
      <>
        {/* variant=42 */}
        <div className={`relative w-10 h-10 overflow-hidden ${className ?? ""}`.trim()}>
          {/* Dentish Chair */}
          <img className="absolute w-10 h-10" src={dentishChair} alt="Dentish Chair" />
        </div>
      </>
    ),
    "46": (
      <>
        {/* variant=46 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant46} alt="variant=46" />
      </>
    ),
    "50": (
      <>
        {/* variant=50 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant50} alt="variant=50" />
      </>
    ),
    "54": (
      <>
        {/* variant=54 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant54} alt="variant=54" />
      </>
    ),
    "58": (
      <>
        {/* variant=58 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant58} alt="variant=58" />
      </>
    ),
    "62": (
      <>
        {/* variant=62 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant62} alt="variant=62" />
      </>
    ),
    "63": (
      <>
        {/* variant=63 */}
        <img className={`w-5 h-5 ${className ?? ""}`.trim()} src={variant63} alt="variant=63" />
      </>
    ),
    "64": (
      <>
        {/* variant=64 */}
        <img className={`w-5 h-5 ${className ?? ""}`.trim()} src={variant64} alt="variant=64" />
      </>
    ),
    "65": (
      <>
        {/* variant=65 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant65} alt="variant=65" />
      </>
    ),
    "66": (
      <>
        {/* variant=66 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant66} alt="variant=66" />
      </>
    ),
    "67": (
      <>
        {/* variant=67 */}
        <img className={`w-7 h-7 ${className ?? ""}`.trim()} src={variant67} alt="variant=67" />
      </>
    ),
    "68": (
      <>
        {/* variant=68 */}
        <div className={`relative w-[52px] h-[22px] overflow-hidden ${className ?? ""}`.trim()}>
          {/* Group */}
          <img className="absolute top-[3px] left-[2px] w-12 h-4" src={group} alt="Group" />
          {/* Vector */}
          <img className="absolute top-[4px] left-[3px] w-3 h-3" src={vector} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[15px] w-2 h-2" src={vector2} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[23px] w-2 h-2" src={vector3} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[31px] w-2 h-2.5" src={vector4} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[4px] left-[40px] w-0.5 h-2.5" src={vector5} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[42px] w-1.5 h-2" src={vector6} alt="Vector" />
        </div>
      </>
    ),
    "69": (
      <>
        {/* variant=69 */}
        <img className={`w-[18px] h-[18px] ${className ?? ""}`.trim()} src={variant69} alt="variant=69" />
      </>
    ),
    "70": (
      <>
        {/* variant=70 */}
        <img className={`w-[18px] h-[18px] ${className ?? ""}`.trim()} src={variant70} alt="variant=70" />
      </>
    ),
    "71": (
      <>
        {/* variant=71 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant71} alt="variant=71" />
      </>
    ),
    "72": (
      <>
        {/* variant=72 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant72} alt="variant=72" />
      </>
    ),
    "73": (
      <>
        {/* variant=73 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant73} alt="variant=73" />
      </>
    ),
    "74": (
      <>
        {/* variant=74 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant74} alt="variant=74" />
      </>
    ),
    "75": (
      <>
        {/* variant=75 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant75} alt="variant=75" />
      </>
    ),
    "76": (
      <>
        {/* variant=76 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant76} alt="variant=76" />
      </>
    ),
    "77": (
      <>
        {/* variant=77 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant77} alt="variant=77" />
      </>
    ),
    "78": (
      <>
        {/* variant=78 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant78} alt="variant=78" />
      </>
    ),
    "79": (
      <>
        {/* variant=79 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant79} alt="variant=79" />
      </>
    ),
    "80": (
      <>
        {/* variant=80 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant80} alt="variant=80" />
      </>
    ),
    "81": (
      <>
        {/* variant=81 */}
        <img className={`w-3 h-3 ${className ?? ""}`.trim()} src={variant81} alt="variant=81" />
      </>
    ),
    "83": (
      <>
        {/* variant=83 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant83} alt="variant=83" />
      </>
    )
  };
  const variantKey = [variant].map(String).join("/");
  const defaultKey = "1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component1;
