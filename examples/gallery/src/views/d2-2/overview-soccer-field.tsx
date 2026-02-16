import { OverviewConfig } from "meridian-ui";
import {
  FetchedAttributeValueType,
  ViewOptions,
} from "meridian-ui";
import { MeridianItem } from "meridian-ui";
import { useODI } from "meridian-ui";
import { Attribute } from "meridian-ui";
import { getAttributesByRole } from "meridian-ui";

export interface OverviewSoccerFieldType extends OverviewConfig {
  type: "soccer-field";
}

export const OverviewSoccerField = (options: ViewOptions) => {
  const { data } = useODI();

  console.log("data", options.items);

  const team1 = options.items.filter(
    (item) =>
      (
        item?.internalAttributes?.find(
          (a: any) => a.label === "team"
        ) as FetchedAttributeValueType
      )?.value === "1"
  );
  const team2 = options.items.filter(
    (item) =>
      (
        item?.internalAttributes?.find(
          (a: any) => a.label === "team"
        ) as FetchedAttributeValueType
      )?.value === "2"
  );

  const findPositionId = (item: any) =>
    item.internalAttributes?.find((a: any) => a.label === "positionId")?.value;

  const findTeamStyle = (player: any) =>
    player.internalAttributes?.find((a: any) => a.label === "team-style")
      ?.value;

  const formation1 = data.team1.formation;
  const formation2 = data.team2.formation;
  const teamStyle1 = data.team1.teamStyle;
  const teamStyle2 = data.team2.teamStyle;

  const TeamFormation = ({
    team,
    formation,
    teamStyle,
    isReversed = false,
  }: {
    team: any[];
    formation: string;
    teamStyle: string;
    isReversed?: boolean;
  }) => {
    // Limit to 11 players max
    const players = team.slice(0, 11);

    // Parse formation string (e.g., "4-2-3-1" -> [4, 2, 3, 1])
    const rows = formation.split("-").map((num) => parseInt(num));

    // Find goalie (usually positionId '1')
    const goalie = players.find((player) => findPositionId(player) === "1");

    // Get field players (non-goalies)
    const fieldPlayers = players.filter(
      (player) => findPositionId(player) !== "1"
    );

    // Calculate positions for each player based on formation
    return (
      <div>
        {/* Render goalie */}
        {goalie && (
          <MeridianItem
            key="goalie"
            item={goalie}
            options={options}
            index={0}
            itemView={{
              type: "player",
            }}
            style={{
              left: "calc(50% - 20px)",
              top: isReversed ? "75%" : "15%",
              // background: teamStyle,
            }}
          />
        )}

        {/* Render field players according to formation */}
        {rows.map((playersInRow, rowIndex) => {
          // Calculate vertical position for this row
          const rowPosition = isReversed
            ? 93 - (rowIndex + 1) * (85 / (rows.length + 1))
            : 17 + (rowIndex + 1) * (85 / (rows.length + 1));

          // Get players for this row
          const startIdx = isReversed
            ? rows.slice(0, rowIndex).reduce((sum, count) => sum + count, 0)
            : rows.slice(0, rowIndex).reduce((sum, count) => sum + count, 0);
          const rowPlayers = fieldPlayers.slice(
            startIdx,
            startIdx + playersInRow
          );

          // Reverse the row players if isReversed is true
          const playersToRender = isReversed
            ? [...rowPlayers].reverse()
            : rowPlayers;

          return playersToRender.map((player, playerIndex) => {
            // Calculate horizontal position
            const horizontalSpacing = 120 / (playersInRow + 1);
            const leftPosition = (playerIndex + 1) * horizontalSpacing;

            // Adjust vertical position for 4-4-2 formation
            // Shift the first and last players in 4-player rows slightly upward
            let adjustedRowPosition = rowPosition;
            if (formation === "4-4-2") {
              adjustedRowPosition = isReversed
                ? rowPosition - 17 // Move slightly down when reversed (which is visually up)
                : rowPosition + 17;

              // Additional condition to shift players in 4-player rows
              if (
                playersInRow === 4 &&
                (playerIndex === 0 || playerIndex === 3)
              ) {
                adjustedRowPosition = isReversed
                  ? rowPosition - 25 // Move even more when reversed for first and last players
                  : rowPosition + 25; // Move even more for first and last players
              }

              if (playersInRow === 2) {
                adjustedRowPosition = isReversed
                  ? rowPosition - 22 // Move slightly down when reversed (which is visually up)
                  : rowPosition + 22;
              }
            }

            return (
              <MeridianItem
                key={`row-${rowIndex}-player-${playerIndex}`}
                item={player}
                options={options}
                index={playerIndex}
                itemView={{
                  type: "player",
                }}
                style={{
                  left: `calc(${leftPosition}% - 70px)`,
                  top: `${adjustedRowPosition}%`,
                  // background: teamStyle,
                }}
              />
            );
          });
        })}
      </div>
    );
  };

  return (
    <div className="overview-basic">
      <div className="relative w-[500px] h-full">
        <img
          src="/examples/r2/assets/field.png"
          alt="soccer field"
          className="w-full h-full object-contain"
        />
        <div className="absolute w-full top-0 h-[50%]">
          <TeamFormation
            team={team1}
            formation={formation1}
            teamStyle={teamStyle1}
          />
        </div>
        <div className="absolute w-full bottom-0 h-[50%]">
          <TeamFormation
            team={team2}
            formation={formation2}
            teamStyle={teamStyle2}
            isReversed={true}
          />
        </div>
      </div>
    </div>
  );
};

const SoccerFieldItem = ({
  item,
  options,
  index,
  className,
  style,
}: {
  item: any;
  options: ViewOptions;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className="w-[42px] h-[42px] absolute p-[8px] rounded-full flex items-center justify-center"
      style={style}
    >
      <div
        className={"w-full h-full rounded-full bg-white flex items-center justify-center flex flex-col items-center justify-center shadow-lg"}
      >
        <div className="relative">
          <Attribute
            className="text-md font-bold"
            options={options}
            attribute={getAttributesByRole(item, "number")}
          />
          <div className="absolute left-1/2 bottom-[-32px] px-2 h-5 transform -translate-x-1/2 flex items-center justify-center bg-black/20 rounded text-white shadow-lg">
            <Attribute
              className="whitespace-nowrap text-lg"
              options={options}
              attribute={getAttributesByRole(item, "name")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
