const products = [
  { id: "product-pan", name: "Pan", price: 2 },
  { id: "product-milk", name: "Leche", price: 3 },
  { id: "product-apple", name: "Manzana", price: 1 },
  { id: "product-juice", name: "Jugo", price: 4 },
  { id: "product-cookies", name: "Galletas", price: 3 },
  { id: "product-cheese", name: "Queso", price: 5 },
];

const mission = {
  budget: 10,
  objectives: [
    { id: "product-pan", name: "Pan", quantity: 2 },
    { id: "product-milk", name: "Leche", quantity: 1 },
    { id: "product-apple", name: "Manzana", quantity: 1 },
  ],
};

function cartItems(cartQuantities) {
  return products
    .map((product) => {
      const quantity = Math.max(0, Math.floor(cartQuantities[product.id] ?? 0));
      return {
        ...product,
        quantity,
        subtotal: product.price * quantity,
      };
    })
    .filter((item) => item.quantity > 0);
}

function evaluateSelection(cartQuantities) {
  const items = cartItems(cartQuantities);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const remainingBudget = mission.budget - total;
  const requiredIds = new Set(mission.objectives.map((objective) => objective.id));
  const extraSelections = items.filter((item) => !requiredIds.has(item.id));
  const objectiveChecks = mission.objectives.map((objective) => {
    const quantity = cartQuantities[objective.id] ?? 0;
    return {
      name: objective.name,
      requiredQuantity: objective.quantity,
      selectedQuantity: quantity,
      isMatched: quantity === objective.quantity,
    };
  });
  const mismatches = objectiveChecks.filter((item) => !item.isMatched);

  return {
    total,
    remainingBudget,
    extraSelections: extraSelections.map((item) => item.name),
    hasSelections: items.length > 0,
    exceedsBudget: total > mission.budget,
    isReadyForCheckout:
      items.length > 0 && mismatches.length === 0 && extraSelections.length === 0 && total <= mission.budget,
  };
}

function evaluatePayment(total, paidAmount) {
  return {
    paidAmount,
    missingAmount: Math.max(0, total - paidAmount),
    change: Math.max(0, paidAmount - total),
    isEnough: total > 0 && paidAmount >= total,
  };
}

const cases = [
  {
    name: "Compra correcta",
    run: () => evaluateSelection({
      "product-pan": 2,
      "product-milk": 1,
      "product-apple": 1,
    }),
    expected: {
      total: 8,
      remainingBudget: 2,
      exceedsBudget: false,
      isReadyForCheckout: true,
    },
  },
  {
    name: "Presupuesto excedido",
    run: () => evaluateSelection({
      "product-pan": 2,
      "product-milk": 1,
      "product-apple": 1,
      "product-cheese": 1,
    }),
    expected: {
      total: 13,
      remainingBudget: -3,
      exceedsBudget: true,
      isReadyForCheckout: false,
    },
  },
  {
    name: "Producto extra no pedido",
    run: () => evaluateSelection({
      "product-pan": 2,
      "product-milk": 1,
      "product-juice": 1,
    }),
    expected: {
      extraSelections: ["Jugo"],
      isReadyForCheckout: false,
    },
  },
  {
    name: "Pago insuficiente",
    run: () => evaluatePayment(8, 5),
    expected: {
      missingAmount: 3,
      change: 0,
      isEnough: false,
    },
  },
  {
    name: "Pago suficiente con cambio",
    run: () => evaluatePayment(8, 10),
    expected: {
      missingAmount: 0,
      change: 2,
      isEnough: true,
    },
  },
  {
    name: "Reparto exacto entre amigos (nivel 3)",
    run: () => evaluateSharing(6, 3),
    expected: {
      quotient: 2,
      remainder: 0,
    },
  },
];

function evaluateSharing(totalQuantity, groupSize) {
  return {
    quotient: Math.floor(totalQuantity / groupSize),
    remainder: totalQuantity % groupSize,
  };
}

let failures = 0;

for (const testCase of cases) {
  const result = testCase.run();
  const mismatches = [];

  for (const [key, expectedValue] of Object.entries(testCase.expected)) {
    const actualValue = result[key];
    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
      mismatches.push({ key, expectedValue, actualValue });
    }
  }

  if (mismatches.length > 0) {
    failures += 1;
    console.log(`FAIL: ${testCase.name}`);
    for (const mismatch of mismatches) {
      console.log(`  ${mismatch.key} -> esperado: ${JSON.stringify(mismatch.expectedValue)}, actual: ${JSON.stringify(mismatch.actualValue)}`);
    }
  } else {
    console.log(`PASS: ${testCase.name}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log("Todos los escenarios base del MVP pasaron correctamente.");
}
