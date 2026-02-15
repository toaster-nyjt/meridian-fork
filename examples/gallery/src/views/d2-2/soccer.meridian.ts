import { BindingItemType, DataBindingType, ODI } from "@meridian-ui/meridian";

export const r2MatchBinding: BindingItemType = {
  itemId: ".id",
  attributes: [
    { value: ".team-logo", roles: ["thumbnail"] },
    { value: ".team", roles: ["title"] },
    { value: ".manager", roles: ["subtitle"] },
    { value: ".formation", roles: ["key-attribute"] },
  ],
};

export const r2PlayersBinding: BindingItemType = {
  itemId: ".name",
  pathToItems: ".lineup",
  internalAttributes: [
    {
      label: "team",
      value: ".team",
      roles: ["team"],
    },
    {
      label: "positionId",
      value: ".positionId",
    }
  ],
  attributes: [
    {
      value: ".name",
      roles: ["name"],
    },
    {
      value: ".numero",
      label: "Número",
      type: "jersey-number",
      roles: ["number", "thumbnail"],
    },
    {
      value: ".nombre",
      label: "Nombre",
      roles: ["fullname", "title"],
    },
    {
      value: ".apellido",
      label: "Apellido",
      roles: ["fullname", "title"],
    },
    {
      value: ".position",
      label: "Posición",
      roles: ["about", "subtitle"],
    },
    {
      value: ".team-name",
      label: "Equipo",
      roles: ["about", "subtitle"],
    },
    {
      value: ".nacionalidad",
      label: "Nacionalidad",
      roles: ["description"],
    },
    {
      value: ".edad",
      label: "Edad",
      roles: ["description"],
    },
    {
      value: ".nacimiento",
      label: "Fecha de nacimiento",
      roles: ["description"],
    },
    {
      value: ".estatura",
      label: "Estatura",
      roles: ["description"],
    },
    {
      value: ".peso",
      label: "Peso",
      roles: ["description"],
    },
    // // Basic player information
    // {
    //   label: 'Información personal',
    //   attributes: [
        
    //   ]
    // },
    // Match statistics
    {
      label: "Estadísticas del partido",
      type: "stats-table",
      attributes: [
        // Player position-specific key attributes
        {
          label: "Goles",
          condition: {
            comparison: {
              field: ".position",
              operator: "!=",
              value: "1"
            }
          },
          roles: ["stats"],
          attributes: [
            {
              value: ".estadisticas_partido.goles.marcados",
              label: "Marcados",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.goles.en_propia_puerta",
              label: "En propia puerta",
              roles: ["spec"],
            }
          ]
        },
        {
          label: "Goles",
          roles: ["stats"],
          condition: {
            comparison: {
              field: ".position",
              operator: "==",
              value: "1"
            }
          },
          attributes: [
            {
              value: ".estadisticas_partido.goles_encajados",
              label: "Encajados",
              roles: ["spec"],
            }
          ]
        },
        
        // Play time
        {
          label: "Tiempo",
          roles: ["stats"],
          attributes: [
            {
              value: ".estadisticas_partido.tiempo.Total jugando",
              label: "Total jugando",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.tiempo.sustitucion.entro_por",
              label: "Entro por",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.tiempo.sustitucion.salio_por",
              label: "Salio por",
              roles: ["spec"],
            }
          ]
        },

        {
          label: "Remates",
          roles: ["stats"],
          attributes: [
            {
              value: ".estadisticas_partido.remates.totales",
              label: "Totales",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.remates.a_puerta",
              label: "A puerta",
              roles: ["spec"],
            }
          ]
        },

        // Passing stats
        {
          label: "Pases",
          roles: ["stats"],
          attributes: [
            {
              value: ".estadisticas_partido.pases.acertados",
              label: "Acertados",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.pases.fallidos",
              label: "Fallidos",
              roles: ["spec"],
            }
          ]
        },
        // Fouls
        {
          label: "Faltas",
          roles: ["stats"],
          attributes: [
            {
              value: ".estadisticas_partido.faltas.recibidas",
              label: "Recibidas",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.faltas.cometidas",
              label: "Cometidas",
              roles: ["spec"],
            }
          ]
        },
        // Cards
        {
          label: "Tarjetas",
          attributes: [
            {
              value: ".estadisticas_partido.tarjetas.amarillas",
              label: "Amarillas",
              roles: ["spec"],
            },
            {
              value: ".estadisticas_partido.tarjetas.rojas",
              label: "Rojas",
              roles: ["spec"],
            }
          ]
        }
      ]
    },
  ],
};

const dataBinding: DataBindingType[] = [
  { id: "match", binding: r2MatchBinding },
  { id: "players", binding: r2PlayersBinding },
  // { id: 'team2', binding: r2PlayersBinding },
];

// * Demoing Direct Manipulation
export const r2ODI: ODI = {
  dataBinding: dataBinding,
  overviews: [
    {
      id: "players",
      type: "soccer-field",
      bindingId: "players",
      shownAttributes: ["number", "name"],
      hiddenAttributes: ["spec", "fullname", "subtitle", "about", "description", "stats", "team", "positionId"],
      detailViews: [
        {
          type: "player",
          openFrom: "all",
        }
      ],
    },
  ],
  malleability: {
    // disabled: true,
    composition: { disabled: true }
  }
};
// export const r2ODI: ODI = {
//   dataBinding: dataBinding,
//   overviews: [
//     {
//       id: 'players',
//       type: 'soccer-field',
//       bindingId: 'players',
//       detailViews: [
//         {
//           type: 'player',
//           // openFrom: 'all',
//           openFrom: ['thumbnail'],
//         }
//       ],
//       hiddenAttributes: ['spec']
//     },
//   ]
// }


    // {
    //   id: 'match',
    //   type: 'r2-match',
    //   bindingId: 'match',
    //   overviews: [
        // {
        //   id: 'team2',
        //   type: 'r2-team',
        //   bindingId: 'team2',
        // },
    //   ]
    // },