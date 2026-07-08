"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { calculateMissionExpectedTotal } from "@/features/market-game/application/use-cases/calculate-mission-expected-total";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { formatSumEquation } from "@/shared/lib/format-equation";
import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { getProductIcon } from "@/shared/config/product-icons";
import { ActionButton } from "@/shared/ui/action-button";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
import { MascotCallout } from "@/shared/ui/mascot-callout";
import { MetricCard } from "@/shared/ui/metric-card";
import { ProgressSteps } from "@/shared/ui/progress-steps";
import { SceneDecorations } from "@/shared/ui/scene-decorations";

function getMissionMascotMessage(mission, possibleSavings) {
  if (mission.id === "level-2") {
    return {
      title: "Hoy preparas una fiesta",
      description: `Aqui compras mas cantidad de productos. Si completas bien la lista y ahorras ${formatCurrency(possibleSavings)}, Michi gana ${possibleSavings} fichas premio.`,
      accent: "coral",
      mood: "cat-happy",
    };
  }

  if (mission.id === "level-3") {
    return {
      title: "Hoy compartes la merienda",
      description: `Ademas de comprar bien, este nivel te prepara para repartir las manzanas en partes iguales. Si te sobran ${formatCurrency(possibleSavings)}, tambien se convierten en fichas.`,
      accent: "sky",
      mood: "thinking",
    };
  }

  return {
    title: "Hoy compras para la merienda",
    description: `Observa con calma. Si compras solo lo pedido, el ahorro de ${formatCurrency(possibleSavings)} se transforma en fichas premio para Michi Money.`,
    accent: "amber",
    mood: "cat-neutral",
  };
}

export function MissionView() {
  const router = useRouter();
  const mission = useMarketGameStore((state) => state.mission);
  const products = useMarketGameStore((state) => state.products);
  const startMission = useMarketGameStore((state) => state.startMission);
  const soundEnabled = useMarketGameStore((state) => state.soundEnabled);
  const expectedTotal = calculateMissionExpectedTotal(mission, products);
  const possibleSavings = Math.max(0, mission.budget - expectedTotal);
  const mascotMessage = getMissionMascotMessage(mission, possibleSavings);
  const { playClick } = useSoundEffects(soundEnabled);

  function handleStart() {
    playClick();
    startMission();
    router.push("/market");
  }

  function handleBackHome() {
    playClick();
    router.push("/");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff3d0_0%,#ffe0a6_30%,#f4ba7b_100%)] px-6 py-10 text-game-ink sm:px-10">
      <SceneDecorations variant="mission" />
      <section className="relative mx-auto max-w-[80rem] space-y-6">
        <ProgressSteps current="mission" />

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-xl"
        >
          <p className="text-sm font-extrabold uppercase tracking-wide text-game-coral">Nivel {mission.level}</p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">{mission.title}</h1>
          <p className="mt-4 max-w-3xl text-xl leading-8 text-game-ink/80">{mission.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Presupuesto disponible" value={formatCurrency(mission.budget)} accent="orange" icon="wallet" />
            <MetricCard label="Total esperado" value={formatCurrency(expectedTotal)} accent="amber" icon="coin" />
            <MetricCard label="Ahorro posible" value={formatCurrency(possibleSavings)} accent="sky" icon="bill" />
            <MetricCard label="Fichas posibles" value={`${possibleSavings}`} accent="emerald" icon="star" />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[1.5rem] bg-game-sun/10 p-6">
              <h2 className="font-heading text-xl font-bold text-game-ink">Lista exacta de compra</h2>
              <ul className="mt-4 space-y-3 text-base text-game-ink/80">
                {mission.objectives.map((objective) => {
                  const product = products.find((item) => item.id === objective.id);
                  const subtotal = (product?.price ?? 0) * objective.quantity;

                  return (
                    <li key={objective.id} className="flex items-center gap-3 rounded-2xl bg-white/80 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                        <EmojiIcon name={getProductIcon(objective.id)} size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-game-ink">{objective.quantity} x {objective.name}</p>
                        <p className="mt-1 text-game-ink/70">{formatCurrency(product?.price ?? 0)} x {objective.quantity} = {formatCurrency(subtotal)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-right font-heading text-lg font-bold text-game-ink">
                {formatSumEquation(
                  mission.objectives.map((objective) => {
                    const product = products.find((item) => item.id === objective.id);
                    return (product?.price ?? 0) * objective.quantity;
                  }),
                  expectedTotal,
                )}
              </div>
            </article>

            <article className="space-y-4">
              <MascotCallout
                title={mascotMessage.title}
                description={mascotMessage.description}
                accent={mascotMessage.accent}
                mood={mascotMessage.mood}
              />
              <article className="rounded-[1.5rem] bg-game-coral/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Que debes cuidar</h2>
                <ul className="mt-4 space-y-3 text-base leading-7 text-game-ink/80">
                  <li>Escoge exactamente las cantidades pedidas.</li>
                  <li>Evita productos extra aunque parezcan utiles.</li>
                  <li>Observa como la multiplicacion forma cada subtotal.</li>
                  <li>El ahorro del presupuesto se convierte en fichas; el cambio de caja solo valida el pago.</li>
                </ul>
              </article>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionButton onClick={handleStart}>Comenzar mision</ActionButton>
            <ActionButton variant="secondary" onClick={handleBackHome}>Volver al inicio</ActionButton>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
