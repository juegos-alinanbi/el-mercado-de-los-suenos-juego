"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { evaluateMissionSelection } from "@/features/market-game/application/use-cases/evaluate-mission-selection";
import { evaluatePayment } from "@/features/market-game/application/use-cases/evaluate-payment";
import { evaluateSharing } from "@/features/market-game/application/use-cases/evaluate-sharing";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { formatSubtractionEquation, formatSumEquation } from "@/shared/lib/format-equation";
import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { ActionButton } from "@/shared/ui/action-button";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
import { MascotCallout } from "@/shared/ui/mascot-callout";
import { MetricCard } from "@/shared/ui/metric-card";
import { ProgressSteps } from "@/shared/ui/progress-steps";
import { RewardTokenDisplay } from "@/shared/ui/reward-token-display";
import { SceneDecorations } from "@/shared/ui/scene-decorations";
import { StatusBanner } from "@/shared/ui/status-banner";

function normalizePaymentHistory(paymentHistory, budget) {
  const acceptedPayments = [];
  let runningTotal = 0;

  for (const payment of paymentHistory) {
    if (runningTotal + payment > budget) {
      break;
    }

    acceptedPayments.push(payment);
    runningTotal += payment;
  }

  return acceptedPayments;
}

function getResultMascotMessage(mission, purchaseSuccess, isLevelComplete, isFinalLevel, earnedTokens, totalTokens) {
  if (!purchaseSuccess) {
    return {
      title: "Casi lo logras",
      description: "Revisa el carrito o el pago y vuelve a intentarlo. Cuando la compra esté bien, el ahorro se convertirá en fichas premio.",
      accent: "amber",
      mood: "cat-worried",
    };
  }

  if (mission.sharing && !isLevelComplete) {
    return {
      title: "La compra ya quedó bien",
      description: "Ahora resuelve el reparto para cerrar la misión y guardar las fichas de este nivel en la alcancía de Michi Money.",
      accent: "sky",
      mood: "thinking",
    };
  }

  if (isFinalLevel && isLevelComplete) {
    return {
      title: "Terminaste toda la aventura",
      description: `Cerraste la última misión, cuidaste el presupuesto y juntaste ${totalTokens} fichas en total. Este cierre especial seguirá apareciendo siempre en el último nivel del juego.`,
      accent: "emerald",
      mood: "party",
    };
  }

  if (mission.id === "level-2") {
    return {
      title: "La fiesta ya tiene premio",
      description: `En este nivel ahorraste y ganaste ${earnedTokens} fichas. Michi Money ya acumula ${totalTokens} fichas para su aventura.`,
      accent: "rose",
      mood: "cat-happy",
    };
  }

  if (mission.id === "level-3") {
    return {
      title: "Compartiste y ahorraste muy bien",
      description: `Además de resolver el reparto, convertiste tu ahorro en ${earnedTokens} fichas. Ya llevas ${totalTokens} fichas acumuladas.`,
      accent: "sky",
      mood: "party",
    };
  }

  return {
    title: "Lo lograste",
    description: `Tu ahorro de este nivel se convirtió en ${earnedTokens} fichas. Ya tienes ${totalTokens} fichas acumuladas para seguir jugando.`,
    accent: "emerald",
    mood: "cat-happy",
  };
}

function FinaleConfetti() {
  const pieces = [
    { left: "6%", top: 90, color: "#ff6b57", rotate: -18, delay: 0 },
    { left: "16%", top: 150, color: "#ffc93c", rotate: 12, delay: 0.2 },
    { left: "28%", top: 78, color: "#38b6ff", rotate: -12, delay: 0.4 },
    { left: "42%", top: 132, color: "#4cc26a", rotate: 18, delay: 0.1 },
    { left: "58%", top: 84, color: "#ff5d8f", rotate: -14, delay: 0.35 },
    { left: "70%", top: 144, color: "#ffc93c", rotate: 20, delay: 0.5 },
    { left: "84%", top: 92, color: "#38b6ff", rotate: -8, delay: 0.25 },
    { left: "92%", top: 166, color: "#ff6b57", rotate: 14, delay: 0.15 },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
      {pieces.map((piece, index) => (
        <motion.span
          key={index}
          initial={{ y: -24, opacity: 0, rotate: piece.rotate - 8 }}
          animate={{ y: [0, 20, 0], opacity: 1, rotate: [piece.rotate - 8, piece.rotate + 8, piece.rotate] }}
          transition={{ duration: 3.2, delay: piece.delay, repeat: Infinity, repeatType: "mirror" }}
          className="absolute h-5 w-3 rounded-full"
          style={{ left: piece.left, top: piece.top, background: piece.color, boxShadow: `0 0 12px ${piece.color}` }}
        />
      ))}
    </div>
  );
}

function FinaleHero({ totalSavedAmount, totalRewardTokens }) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,245,199,0.96),rgba(221,255,213,0.96))] p-6 shadow-[0_28px_80px_rgba(76,194,106,0.22)] sm:p-8"
    >
      <FinaleConfetti />
      <div className="absolute inset-x-[18%] top-8 h-40 rounded-full bg-game-sun/20 blur-3xl" />
      <div className="relative z-10 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-white shadow-lg">
          <EmojiIcon name="trophy" size={58} />
        </div>
        <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.24em] text-game-coral">Gran final del juego</p>
        <h2 className="mt-3 font-heading text-4xl font-bold text-game-ink sm:text-5xl">Aventura completada</h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-game-ink/80 sm:text-xl">
          Michi Money celebró tu ayuda porque compraste bien, pagaste bien y compartiste bien. Este bloque aparece siempre cuando completas el último nivel disponible.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border-2 border-game-sun/40 bg-white/85 p-5 text-left shadow-sm">
            <p className="text-sm font-extrabold uppercase tracking-wide text-game-coral">Premio final</p>
            <p className="mt-2 font-heading text-3xl font-bold text-game-ink">Comprador inteligente</p>
            <p className="mt-2 text-base leading-7 text-game-ink/75">
              Terminaste todas las misiones del mercado y convertiste tus buenas decisiones en un premio visible.
            </p>
          </div>
          <div className="rounded-[1.5rem] border-2 border-game-grass/35 bg-white/85 p-5 text-left shadow-sm">
            <p className="text-sm font-extrabold uppercase tracking-wide text-game-grass">Resumen final</p>
            <p className="mt-2 text-lg font-bold text-game-ink">Ahorro total: {formatCurrency(totalSavedAmount)}</p>
            <div className="mt-3">
              <RewardTokenDisplay count={totalRewardTokens} maxVisible={10} size={20} tone="sun" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ResultView() {
  const router = useRouter();
  const levels = useMarketGameStore((state) => state.levels);
  const mission = useMarketGameStore((state) => state.mission);
  const products = useMarketGameStore((state) => state.products);
  const cartQuantities = useMarketGameStore((state) => state.cartQuantities);
  const paymentHistory = useMarketGameStore((state) => state.paymentHistory);
  const hasSubmittedPayment = useMarketGameStore((state) => state.hasSubmittedPayment);
  const resetGame = useMarketGameStore((state) => state.resetGame);
  const restartAdventure = useMarketGameStore((state) => state.restartAdventure);
  const selectLevel = useMarketGameStore((state) => state.selectLevel);
  const markLevelCompleted = useMarketGameStore((state) => state.markLevelCompleted);
  const registerMissionReward = useMarketGameStore((state) => state.registerMissionReward);
  const soundEnabled = useMarketGameStore((state) => state.soundEnabled);
  const savedAmount = useMarketGameStore((state) => state.savedAmount);
  const rewardTokens = useMarketGameStore((state) => state.rewardTokens);
  const rewardedLevels = useMarketGameStore((state) => state.rewardedLevels);
  const sharingAnswer = useMarketGameStore((state) => state.sharingAnswer);
  const incrementSharingAnswer = useMarketGameStore((state) => state.incrementSharingAnswer);
  const decrementSharingAnswer = useMarketGameStore((state) => state.decrementSharingAnswer);
  const { playClick, playSuccess } = useSoundEffects(soundEnabled);
  const hasPlayedSuccessRef = useRef(false);

  const missionState = evaluateMissionSelection(mission, products, cartQuantities);
  const visiblePaymentHistory = normalizePaymentHistory(paymentHistory, mission.budget);
  const effectivePaidAmount = visiblePaymentHistory.reduce((total, value) => total + value, 0);
  const paymentState = evaluatePayment(missionState.total, effectivePaidAmount);
  const purchaseSuccess = hasSubmittedPayment && missionState.isReadyForCheckout && paymentState.isEnough;
  const sharingState = mission.sharing ? evaluateSharing(mission.sharing, sharingAnswer) : null;
  const isSharingComplete = mission.sharing ? Boolean(sharingState?.isCorrect) : true;
  const isLevelComplete = purchaseSuccess && isSharingComplete;
  const missionSavings = purchaseSuccess ? Math.max(0, mission.budget - missionState.total) : 0;
  const earnedTokens = isLevelComplete ? missionSavings : 0;
  const rewardAlreadyRegistered = rewardedLevels.includes(mission.id);
  const totalSavedAmount = savedAmount + (isLevelComplete && !rewardAlreadyRegistered ? missionSavings : 0);
  const totalRewardTokens = rewardTokens + (isLevelComplete && !rewardAlreadyRegistered ? earnedTokens : 0);
  const currentLevelIndex = levels.findIndex((level) => level.id === mission.id);
  const nextLevel = currentLevelIndex >= 0 ? levels[currentLevelIndex + 1] ?? null : null;
  const isFinalLevel = nextLevel === null;
  const mascotMessage = getResultMascotMessage(
    mission,
    purchaseSuccess,
    isLevelComplete,
    isFinalLevel,
    earnedTokens,
    totalRewardTokens,
  );

  useEffect(() => {
    if (isLevelComplete && !hasPlayedSuccessRef.current) {
      playSuccess();
      hasPlayedSuccessRef.current = true;
      markLevelCompleted(mission.id);
      registerMissionReward({
        levelId: mission.id,
        savedAmount: missionSavings,
        rewardTokens: earnedTokens,
      });
    }

    if (!isLevelComplete) {
      hasPlayedSuccessRef.current = false;
    }
  }, [earnedTokens, isLevelComplete, markLevelCompleted, mission.id, missionSavings, playSuccess, registerMissionReward]);

  function handleRetryLevel() {
    playClick();
    resetGame();
    router.push("/mission");
  }

  function handleRestartAdventure() {
    playClick();
    restartAdventure();
    router.push("/mission");
  }

  function handleBackCheckout() {
    playClick();
    router.push("/checkout");
  }

  function handleBackMarket() {
    playClick();
    router.push("/market");
  }

  function handleGoNextLevel() {
    if (!nextLevel) {
      return;
    }

    playClick();
    selectLevel(nextLevel.id);
    router.push("/mission");
  }

  function handleGoHome() {
    playClick();
    router.push("/");
  }

  function handleIncrementSharing() {
    playClick();
    incrementSharingAnswer();
  }

  function handleDecrementSharing() {
    playClick();
    decrementSharingAnswer();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#eefae8_0%,#d9f3c0_32%,#a7dfb3_100%)] px-6 py-10 text-game-ink sm:px-10">
      <SceneDecorations variant="result" />
      {purchaseSuccess ? (
        <>
          <div className="pointer-events-none absolute left-[8%] top-14 animate-float-bob">
            <EmojiIcon name="party" size={56} />
          </div>
          <div className="pointer-events-none absolute right-[10%] top-24 animate-float-bob" style={{ animationDelay: "0.5s" }}>
            <EmojiIcon name="star" size={44} />
          </div>
          <div className="pointer-events-none absolute bottom-16 left-[20%] animate-float-bob" style={{ animationDelay: "0.9s" }}>
            <EmojiIcon name="sparkles" size={40} />
          </div>
        </>
      ) : null}

      <section className="relative mx-auto max-w-[70rem] space-y-6">
        <ProgressSteps current="result" />

        {isLevelComplete && isFinalLevel ? <FinaleHero totalSavedAmount={totalSavedAmount} totalRewardTokens={totalRewardTokens} /> : null}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="animate-pop-in flex h-16 w-16 items-center justify-center rounded-full bg-game-grass/15">
              <EmojiIcon name={isLevelComplete ? "trophy" : purchaseSuccess ? "party" : "cat-worried"} size={44} />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-game-grass">Resultado final</p>
              <h1 className="mt-1 font-heading text-3xl font-bold text-game-ink sm:text-4xl">
                {isLevelComplete
                  ? isFinalLevel
                    ? "Último nivel completado con éxito"
                    : "Misión completada con éxito"
                  : purchaseSuccess && mission.sharing
                    ? "Compra correcta, falta el reparto"
                    : "La partida aún no está completa"}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-xl leading-8 text-game-ink/80">
            {isLevelComplete
              ? isFinalLevel
                ? "Cerraste la última misión disponible. Este final especial siempre aparecerá en el último nivel del juego, aunque después agregues más niveles nuevos."
                : "Lograste comprar exactamente lo pedido, respetaste el presupuesto y transformaste tu ahorro en fichas premio."
              : purchaseSuccess && mission.sharing
                ? "La compra y el pago ya están correctos. Ahora resuelve el reparto para cerrar este nivel y guardar el premio final."
                : "Todavía hay algo por corregir en la compra o en el pago. Revisa el detalle antes de volver a intentarlo."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Compra correcta" value={missionState.isReadyForCheckout ? "Sí" : "No"} accent="emerald" icon="check" />
            <MetricCard label="Cambio de caja" value={formatCurrency(paymentState.change)} accent="sky" icon="coin" />
            <MetricCard label="Ahorro del nivel" value={formatCurrency(missionSavings)} accent="amber" icon="bill" />
            <MetricCard
              label="Fichas ganadas"
              value={`${earnedTokens}`}
              accent="rose"
              icon="star"
              detail={<RewardTokenDisplay count={earnedTokens} tone="rose" />}
            />
          </div>

          {isLevelComplete ? (
            <article className="mt-6 rounded-[1.75rem] border-2 border-game-berry/20 bg-gradient-to-r from-game-sun/15 via-white to-game-berry/10 p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wide text-game-berry">Alcancía de Michi Money</p>
                  <h2 className="mt-1 font-heading text-2xl font-bold text-game-ink">
                    {isFinalLevel ? "Tu premio final ya quedó guardado" : "Tu ahorro ya se convirtió en premio"}
                  </h2>
                  <p className="mt-2 max-w-xl text-base leading-7 text-game-ink/75">
                    {isFinalLevel
                      ? "Llegaste al cierre de la aventura. La alcancía ya muestra todo lo que juntaste durante el recorrido."
                      : "Cada ficha representa una compra inteligente. Mientras mejor administras el presupuesto, más llena queda la alcancía de Michi Money."}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-game-ink shadow-sm">
                    Ahorro acumulado: {formatCurrency(totalSavedAmount)}
                  </div>
                  <RewardTokenDisplay count={totalRewardTokens} maxVisible={8} size={20} tone="sun" />
                </div>
              </div>
            </article>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <article className="rounded-[1.5rem] bg-slate-50 p-6">
              <h2 className="font-heading text-xl font-bold text-game-ink">Detalle matemático</h2>
              <div className="mt-4 space-y-3 text-base text-game-ink/80">
                {missionState.objectiveChecks.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white px-4 py-3">
                    <p className="font-bold text-game-ink">{item.name}</p>
                    <p>{item.selectedQuantity} x {formatCurrency(item.price)} = {formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
                <div className="rounded-2xl bg-white px-4 py-3 text-right font-heading font-bold text-game-ink">
                  {formatSumEquation(
                    missionState.objectiveChecks.map((item) => item.subtotal),
                    missionState.objectiveChecks.reduce((sum, item) => sum + item.subtotal, 0),
                  )}
                </div>
              </div>
            </article>

            <article className="space-y-4">
              <article className="rounded-[1.5rem] bg-game-coral/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Así terminó tu compra</h2>
                <ul className="mt-4 space-y-3 text-base leading-7 text-game-ink/80">
                  <li>Tu compra costaba {formatCurrency(missionState.total)}.</li>
                  <li>Michi Money tenía {formatCurrency(mission.budget)} de presupuesto para este nivel.</li>
                  <li>En caja entregaste {formatCurrency(paymentState.paidAmount)}.</li>
                  <li>
                    Ahorro del presupuesto: {formatSubtractionEquation(mission.budget, missionState.total, Math.max(0, mission.budget - missionState.total))}.
                  </li>
                  <li>
                    {paymentState.isExact
                      ? "Tu pago fue exacto, por eso no recibes cambio."
                      : `Cambio de caja: ${formatSubtractionEquation(paymentState.paidAmount, missionState.total, paymentState.change)}.`}
                  </li>
                  <li>Las fichas salen del ahorro del presupuesto, no del cambio que devuelve la caja.</li>
                </ul>

                {visiblePaymentHistory.length > 0 ? (
                  <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-base font-bold text-game-ink">
                    Dinero usado en caja: {visiblePaymentHistory.map(formatCurrency).join(" + ")}
                  </div>
                ) : null}

                <div className="mt-5">
                  <StatusBanner
                    message={
                      isLevelComplete
                        ? paymentState.isExact
                          ? `Excelente trabajo. Pagaste exacto y ganaste ${earnedTokens} fichas por tu ahorro.`
                          : `Excelente trabajo. Recibes ${formatCurrency(paymentState.change)} de cambio y ganas ${earnedTokens} fichas por ahorrar.`
                        : purchaseSuccess && mission.sharing
                          ? "Tu compra ya es correcta. Resuelve el reparto para guardar las fichas de este nivel."
                          : paymentState.statusMessage
                    }
                    tone={isLevelComplete ? "success" : purchaseSuccess && mission.sharing ? "neutral" : "warning"}
                  />
                </div>
              </article>

              <MascotCallout
                title={mascotMessage.title}
                description={mascotMessage.description}
                accent={mascotMessage.accent}
                mood={mascotMessage.mood}
              />
            </article>
          </div>

          {purchaseSuccess && mission.sharing && !isLevelComplete ? (
            <article className="mt-6 rounded-[1.75rem] border-2 border-game-sky/30 bg-game-sky/10 p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-heading text-xl font-bold text-game-ink">Te falta cerrar el reto final</h2>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-game-ink/80">
                    La compra ya está validada, pero este nivel solo se completa cuando resuelves bien el reparto. Al acertar, se guardarán {missionSavings} fichas y {formatCurrency(missionSavings)} de ahorro en tu progreso.
                  </p>
                </div>
                <RewardTokenDisplay count={missionSavings} maxVisible={6} size={18} tone="sky" />
              </div>
            </article>
          ) : null}

          {isLevelComplete ? (
            <article className="mt-6 rounded-[1.75rem] bg-game-grass/10 p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-game-ink">
                {nextLevel ? `Desbloqueaste el nivel ${nextLevel.level}` : "Completaste todos los niveles"}
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-game-ink/80">
                {nextLevel
                  ? `Ya puedes continuar con ${nextLevel.title}. Tu ahorro y tus fichas quedan guardados para seguir la aventura.`
                  : `Ya terminaste todas las misiones disponibles. Te llevas ${formatCurrency(totalSavedAmount)} de ahorro y ${totalRewardTokens} fichas acumuladas.`}
              </p>
              {!nextLevel ? (
                <div className="mt-4">
                  <RewardTokenDisplay count={totalRewardTokens} maxVisible={10} size={20} tone="sun" />
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                {nextLevel ? (
                  <ActionButton onClick={handleGoNextLevel}>Ir al siguiente nivel</ActionButton>
                ) : (
                  <ActionButton onClick={handleGoHome}>{isFinalLevel ? "Cerrar aventura" : "Volver al inicio"}</ActionButton>
                )}
              </div>
            </article>
          ) : null}

          {purchaseSuccess && mission.sharing ? (
            <article className="mt-6 rounded-[1.5rem] bg-game-sky/10 p-6">
              <h2 className="font-heading text-xl font-bold text-game-ink">Reto extra: reparto</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-game-ink/80">
                Tienes {mission.sharing.totalQuantity} {mission.sharing.productNamePlural} para repartir en partes iguales entre Michi Money y sus amigos ({mission.sharing.groupSize} en total). ¿Cuántas le tocan a cada uno?
              </p>

              <div className="mt-4 flex w-fit items-center gap-3 rounded-2xl bg-white p-3">
                <button
                  type="button"
                  onClick={handleDecrementSharing}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-slate-300 bg-white text-xl font-black text-game-ink transition active:translate-y-1 active:border-b-0"
                >
                  -
                </button>
                <span className="w-10 text-center font-heading text-2xl font-bold text-game-ink">{sharingAnswer}</span>
                <button
                  type="button"
                  onClick={handleIncrementSharing}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-[#c7381f] bg-game-coral text-xl font-black text-white transition active:translate-y-1 active:border-b-0"
                >
                  +
                </button>
              </div>

              <div className="mt-4">
                <StatusBanner
                  message={
                    sharingAnswer === 0
                      ? "Ajusta el contador para responder."
                      : sharingState.isCorrect
                        ? `Correcto. ${mission.sharing.totalQuantity} entre ${mission.sharing.groupSize} son ${sharingState.quotient} para cada uno.`
                        : "Todavía no es correcto, sigue intentando."
                  }
                  tone={sharingAnswer === 0 ? "neutral" : sharingState.isCorrect ? "success" : "warning"}
                />
              </div>
            </article>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionButton variant="success" onClick={handleRetryLevel}>Reintentar nivel actual</ActionButton>
            <ActionButton variant="danger" onClick={handleRestartAdventure}>Reiniciar partida completa</ActionButton>
            <ActionButton variant="secondary" onClick={handleBackCheckout}>Volver a caja</ActionButton>
            <ActionButton variant="secondary" onClick={handleBackMarket}>Revisar carrito</ActionButton>
          </div>
        </motion.section>
      </section>
    </main>
  );
}


