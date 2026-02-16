import { MeridianItem } from "../../renderer/renderer";
import { OverviewConfig } from "../../spec/spec";
import { ViewOptions } from "../../spec/spec.internal";
import "./overview-basic.scss";

export interface OverviewBasicListType extends OverviewConfig {
  type: "list";
}

export const OverviewBasicList = (options: ViewOptions) => {
  return (
    <div
      className="overview-basic"
      // style={{
      //   backgroundColor: 'red',
      // }}
    >
      <div className={`overview-basic-container ${options.overview.className}`}>
        {options.items.map((item, index) => (
          <MeridianItem
            key={index}
            options={options}
            item={item}
            itemView={options.overview.itemView}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

{
  /* <div className="w-full flex flex-col gap-2 p-2">
            <div className="flex flex-row w-full gap-1">
              <div className="min-w-[130px] max-w-[130px] h-[160px] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt={`profile-${item.name}`}
                  src={item.profilePic}
                />
              </div>
              <div className="w-full flex flex-col justify-between p-2">
                <p className="flex justify-end text-sm">{item.title}</p>
                <div className="flex flex-col">
                  <h2 className="font-bold my-0.5">{item.name}</h2>
                  <p className="text-zinc-400">{item.shortBio}</p>
                </div>
                <p className="flex justify-end text-sm">links</p>
              </div>
            </div>
            <div className="my-2">
              {item.longBio.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <div className="my-4" />
                </React.Fragment>
              ))}
            </div>
          </div> */
}
