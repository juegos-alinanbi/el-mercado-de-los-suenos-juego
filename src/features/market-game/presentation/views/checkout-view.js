"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { evaluateMissionSelection } from "@/features/market-game/application/use-cases/evaluate-mission-selection";
import { evaluatePayment } from "@/features/market-game/application/use-cases/evaluate-payment";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { getProductIcon } from "@/shared/config/product-icons";
import { ActionButton } from "@/shared/ui/action-button";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
import { MascotCallout } from "@/shared/ui/mascot-callout";
import { MetricCard } from "@/shared/ui/metric-card";
import { ProgressSteps } from "@/shared/ui/progress-steps";
import { SceneDecorations } from "@/shared/ui/scene-decorations";
import { StatusBanner } from "@/shared/ui/status-banner";

function iconForPaymentType(type) {
  return type === "Billete" ? "bill" : "coin";
}

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

export function CheckoutView() {
  const router = useRouter();
  const mission = useMarketGameStore((state) => state.mission);
  const products = useMarketGameStore((state) => state.products);
  const paymentOptions = useMarketGameStore((state) => state.paymentOptions);
  const cartQuantities = useMarketGameStore((state) => state.cartQuantities);
  const paymentHistory = useMarketGameStore((state) => state.paymentHistory);
  const addPayment = useMarketGameStore((state) => state.addPayment);
  const removeLastPayment = useMarketGameStore((state) => state.removeLastPayment);
  const clearPayment = useMarketGameStore((state) => state.clearPayment);
  const submitPayment = useMarketGameStore((state) => state.submitPayment);
  const soundEnabled = useMarketGameStore((state) => state.soundEnabled);
  const changeAnswer = useMarketGameStore((state) => state.changeAnswer);
  const incrementChangeAnswer = useMarketGameStore((state) => state.incrementChangeAnswer);
  const decrementChangeAnswer = useMarketGameStore((state) => state.decrementChangeAnswer);
  const changeCheckResult = useMarketGameStore((state) => state.changeCheckResult);
  const changeAttempts = useMarketGameStore((state) => state.changeAttempts);
  const checkChangeAnswer = useMarketGameStore((state) => state.checkChangeAnswer);
  const { playClick, playCoin, playSuccess, playError } = useSoundEffects(soundEnabled);

  const missionState = evaluateMissionSelection(mission, products, cartQuantities);
  const visiblePaymentHistory = normalizePaymentHistory(paymentHistory, mission.budget);
  const effectivePaidAmount = visiblePaymentHistory.reduce((total, value) => total + value, 0);
  const remainingWallet = Math.max(0, mission.budget - effectivePaidAmount);
  const paymentState = evaluatePayment(missionState.total, effectivePaidAmount);
  const availablePaymentOptions = paymentOptions.filter((option) => option.value <= mission.budget);
  const paymentSummaryTone = paymentState.isEnough ? "success" : paymentState.paidAmount > 0 ? "warning" : "neutral";

  const isLevel1 = mission.level === 1;
  const isOverpaidForLevel1 = isLevel1 && paymentState.paidAmount > missionState.total;
  const needsChangeCheck = !isLevel1 && paymentState.isEnough && !paymentState.isExact;
  const isChangeCorrect = changeCheckResult === "correct";
  const canConfirm = isLevel1
    ? paymentState.isExact
    : paymentState.isEnough && (paymentState.isExact || isChangeCorrect);

  const paymentBannerMessage = isOverpaidForLevel1 ? "Te pasaste. Intenta pagar exacto." : paymentState.statusMessage;
  const paymentBannerTone = isOverpaidForLevel1 ? "danger" : paymentSummaryTone;

  const fourthMetric = isLevel1
    ? {
        label: "Estado del pago",
        value: paymentState.isExact
          ? "¡Exacto!"
          : isOverpaidForLevel1
            ? "Te pasaste"
            : `Faltan ${formatCurrency(paymentState.missingAmount)}`,
        accent: paymentState.isExact ? "emerald" : isOverpaidForLevel1 ? "rose" : "amber",
        icon: paymentState.isExact ? "check" : "cross",
      }
    : {
        label: paymentState.isEnough ? "Cambio que recibes" : "Falta para pagar",
        value: paymentState.isEnough
          ? needsChangeCheck && !isChangeCorrect
            ? "$?"
            : formatCurrency(paymentState.change)
          : formatCurrency(paymentState.missingAmount),
        accent: paymentState.isEnough ? "emerald" : "amber",
        icon: paymentState.isEnough ? "check" : "cross",
      };

  function handleFinishPayment() {
    if (!canConfirm) {
      playError();
      return;
    }
    playSuccess();
    submitPayment();
    router.push("/result");
  }

  function handleIncrementChange() {
    playCoin();
    incrementChangeAnswer();
  }

  function handleDecrementChange() {
    if (changeAnswer <= 0) {
      playError();
      return;
    }
    playClick();
    decrementChangeAnswer();
  }

  function handleCheckChange() {
    const isCorrect = changeAnswer === paymentState.change;
    if (isCorrect) {
      playSuccess();
    } else {
      playError();
    }
    checkChangeAnswer(paymentState.change);
  }

  function handleAddPayment(value) {
    if (value > remainingWallet) {
      playError();
      return;
    }

    playCoin();
    addPayment(value);
  }

  function handleRemoveLastPayment() {
    if (paymentHistory.length === 0) {
      playError();
      return;
    }
    playClick();
    removeLastPayment();
  }

  function handleClearPayment() {
    if (paymentHistory.length === 0) {
      playError();
      return;
    }
    playError();
    clearPayment();
  }

  function handleBackMarket() {
    playClick();
    router.push("/market");
  }

  if (!missionState.isReadyForCheckout) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff0eb_0%,#ffd6c7_32%,#f1a181_100%)] px-4 py-8 text-game-ink sm:px-8 lg:px-10 xl:px-12">
        <SceneDecorations variant="checkout" />
        <section className="relative mx-auto max-w-[72rem] space-y-6">
          <ProgressSteps current="checkout" />
          <article className="rounded-[2rem] border-4 border-white bg-white/90 p-6 shadow-xl sm:p-8 lg:p-9">
            <p className="text-sm font-extrabold uppercase tracking-wide text-game-berry">Caja bloqueada</p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">La compra aún no es válida</h1>
            <div className="mt-6">
              <StatusBanner message={missionState.statusMessage} tone="danger" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton variant="danger" onClick={handleBackMarket}>Volver al mercado</ActionButton>
            </div>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff0eb_0%,#ffd6c7_32%,#f1a181_100%)] px-4 py-8 text-game-ink sm:px-8 lg:px-10 xl:px-12">
      <SceneDecorations variant="checkout" />
      <section className="relative mx-auto max-w-[94rem] space-y-6">
        <ProgressSteps current="checkout" />
        <section className="rounded-[2rem] border-4 border-white bg-white/90 p-6 shadow-xl sm:p-8 lg:p-9">
          <p className="text-sm font-extrabold uppercase tracking-wide text-game-berry">Caja y pago</p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">Paga solo con el dinero disponible</h1>
          <p className="mt-3 max-w-4xl text-lg leading-8 text-game-ink/75">
            Michi Money tiene {formatCurrency(mission.budget)} para comprar y pagar en caja.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <MetricCard label="Total a pagar" value={formatCurrency(missionState.total)} accent="orange" icon="cart" />
            <MetricCard label="Dinero entregado" value={formatCurrency(paymentState.paidAmount)} accent="rose" icon="wallet" />
            <MetricCard label="Dinero que te queda" value={formatCurrency(remainingWallet)} accent={remainingWallet > 0 ? "sky" : "stone"} icon="bill" />
            <MetricCard label={fourthMetric.label} value={fourthMetric.value} accent={fourthMetric.accent} icon={fourthMetric.icon} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.08fr]">
            <aside className="space-y-4">
              {mission.level === 3 ? (
                <MascotCallout
                  title="Reto extra"
                  description="Paga con la menor cantidad de monedas y billetes posible y ganarás fichas bonus."
                  accent="sky"
                  mood="thinking"
                />
              ) : null}

              <article className="rounded-[1.5rem] bg-game-berry/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Compra validada</h2>
                <div className="mt-4 space-y-3 text-base text-game-ink/80">
                  {missionState.cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3">
                      <span className="flex items-center gap-2">
                        <EmojiIcon name={getProductIcon(item.id)} size={22} />
                        {item.quantity} x {item.name}
                      </span>
                      <strong>{formatCurrency(item.subtotal)}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-game-coral/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Dinero que ya entregaste</h2>
                <div className="mt-4 flex flex-wrap gap-2 text-base text-game-ink/80">
                  {visiblePaymentHistory.length > 0 ? (
                    visiblePaymentHistory.map((value, index) => (
                      <motion.span
                        key={`${value}-${index}`}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-full bg-white px-3 py-1 font-bold text-game-berry"
                      >
                        {formatCurrency(value)}
                      </motion.span>
                    ))
                  ) : (
                    <span>Aún no has seleccionado dinero.</span>
                  )}
                </div>
              </article>
            </aside>

            <div className="space-y-4">
              <article className="rounded-[1.5rem] bg-slate-50 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">
                  ¿Cómo pagas? Te quedan {formatCurrency(remainingWallet)}
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {availablePaymentOptions.map((option, index) => {
                    const isDisabled = option.value > remainingWallet;

                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        onClick={() => handleAddPayment(option.value)}
                        disabled={isDisabled}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: index * 0.04 }}
                        whileHover={isDisabled ? undefined : { y: -3, scale: 1.02 }}
                        whileTap={isDisabled ? undefined : { scale: 0.98 }}
                        className={`flex flex-col items-center gap-2 rounded-[1.5rem] border-b-4 bg-white p-5 text-center shadow-sm ${
                          isDisabled
                            ? "cursor-not-allowed border-slate-100 opacity-40"
                            : "border-slate-200 active:translate-y-1 active:border-b-0"
                        }`}
                      >
                        <EmojiIcon name={iconForPaymentType(option.type)} size={36} />
                        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{option.type}</p>
                        <p className="font-heading text-3xl font-bold text-game-ink">{formatCurrency(option.value)}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </article>

              {needsChangeCheck ? (
                <article className="rounded-[1.5rem] bg-game-sky/10 p-6">
                  <h2 className="font-heading text-xl font-bold text-game-ink">¿Cuánto cambio recibes?</h2>

                  <div className="mt-4 flex w-fit items-center gap-3 rounded-2xl bg-white p-3">
                    <button
                      type="button"
                      onClick={handleDecrementChange}
                      className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-slate-300 bg-white text-xl font-black text-game-ink transition active:translate-y-1 active:border-b-0"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-heading text-2xl font-bold text-game-ink">{formatCurrency(changeAnswer)}</span>
                    <button
                      type="button"
                      onClick={handleIncrementChange}
                      className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-[#c7381f] bg-game-coral text-xl font-black text-white transition active:translate-y-1 active:border-b-0"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-4">
                    <ActionButton variant="success" onClick={handleCheckChange}>Comprobar</ActionButton>
                  </div>

                  <div className="mt-4">
                    <StatusBanner
                      message={
                        changeCheckResult === "correct"
                          ? "¡Correcto! Ya puedes confirmar el pago."
                          : changeCheckResult === "incorrect"
                            ? changeAttempts === 1
                              ? "Resta el total al dinero entregado."
                              : changeAttempts === 2
                                ? "Cuenta billete por billete lo que sobra."
                                : `El cambio correcto es ${formatCurrency(paymentState.change)}. Ajusta el contador a ese número y presiona Comprobar.`
                            : "Ajusta el contador y presiona Comprobar cuando tengas tu respuesta."
                      }
                      tone={changeCheckResult === "correct" ? "success" : changeCheckResult === "incorrect" ? "warning" : "neutral"}
                    />
                  </div>
                </article>
              ) : null}

              <StatusBanner message={paymentBannerMessage} tone={paymentBannerTone} />

              <div className="flex flex-wrap gap-3">
                <ActionButton variant="danger" onClick={handleFinishPayment} disabled={!canConfirm}>Confirmar pago</ActionButton>
                <ActionButton variant="secondary" onClick={handleRemoveLastPayment} disabled={paymentHistory.length === 0}>Quitar último monto</ActionButton>
                <ActionButton variant="secondary" onClick={handleClearPayment} disabled={paymentHistory.length === 0}>Limpiar pago</ActionButton>
                <ActionButton variant="secondary" onClick={handleBackMarket}>Volver al mercado</ActionButton>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

