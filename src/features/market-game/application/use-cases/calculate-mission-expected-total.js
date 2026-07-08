export function calculateMissionExpectedTotal(mission, products) {
  return mission.objectives.reduce((total, objective) => {
    const product = products.find((item) => item.id === objective.id);

    if (!product) {
      return total;
    }

    return total + product.price * objective.quantity;
  }, 0);
}
