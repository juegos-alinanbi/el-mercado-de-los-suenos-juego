export const missionsMock = [
  {
    id: "level-1",
    level: 1,
    title: "Misión 1: La compra para la merienda",
    description:
      "Ayuda a Michi Money a comprar 2 panes, 1 leche y 1 manzana sin superar el presupuesto de $10.",
    budget: 10,
    objectives: [
      { id: "product-pan", name: "Pan", quantity: 2 },
      { id: "product-milk", name: "Leche", quantity: 1 },
      { id: "product-apple", name: "Manzana", quantity: 1 },
    ],
    sharing: null,
  },
  {
    id: "level-2",
    level: 2,
    title: "Misión 2: La fiesta de cumpleaños",
    description:
      "Michi Money organiza una fiesta y necesita comprar más cantidad de cada cosa sin superar el presupuesto de $20.",
    budget: 20,
    objectives: [
      { id: "product-pan", name: "Pan", quantity: 3 },
      { id: "product-milk", name: "Leche", quantity: 2 },
      { id: "product-apple", name: "Manzana", quantity: 2 },
      { id: "product-cheese", name: "Queso", quantity: 1 },
    ],
    sharing: null,
  },
  {
    id: "level-3",
    level: 3,
    title: "Misión 3: La merienda compartida",
    description:
      "Michi Money invita a 2 amigos a la merienda. Compra lo necesario y luego reparte las manzanas en partes iguales entre los 3.",
    budget: 15,
    objectives: [
      { id: "product-pan", name: "Pan", quantity: 2 },
      { id: "product-milk", name: "Leche", quantity: 1 },
      { id: "product-apple", name: "Manzana", quantity: 6 },
    ],
    sharing: {
      productId: "product-apple",
      productName: "Manzana",
      productNamePlural: "manzanas",
      totalQuantity: 6,
      groupSize: 3,
    },
  },
];

export const defaultMission = missionsMock[0];
