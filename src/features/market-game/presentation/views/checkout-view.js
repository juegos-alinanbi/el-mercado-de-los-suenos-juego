"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { evaluateMissionSelection } from "@/features/market-game/application/use-cases/evaluate-mission-selection";
import { evaluatePayment } from "@/features/market-game/application/use-cases/evaluate-payment";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { formatComparison, formatSubtractionEquation } from "@/shared/lib/format-equation";
import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { getProductIcon } from "@/shared/config/product-icons";
import { ActionButton } from "@/shared/ui/action-button";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
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
  const { playClick, playCoin, playSuccess, playError } = useSoundEffects(soundEnabled);

  const missionState = evaluateMissionSelection(mission, products, cartQuantities);
  const visiblePaymentHistory = normalizePaymentHistory(paymentHistory, mission.budget);
  const effectivePaidAmount = visiblePaymentHistory.reduce((total, value) => total + value, 0);
  const remainingWallet = Math.max(0, mission.budget - effectivePaidAmount);
  const paymentState = evaluatePayment(missionState.total, effectivePaidAmount);
  const availablePaymentOptions = paymentOptions.filter((option) => option.value <= mission.budget);
  const paymentSummaryTone = paymentState.isEnough ? "success" : paymentState.paidAmount > 0 ? "warning" : "neutral";

  function handleFinishPayment() {
    if (!paymentState.isEnough) {
      playError();
      return;
    }
    playSuccess();
    submitPayment();
    router.push("/result");
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
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff0eb_0%,#ffd6c7_32%,#f1a181_100%)] px-6 py-10 text-game-ink sm:px-10">
        <SceneDecorations variant="checkout" />
        <section className="relative mx-auto max-w-5xl space-y-6">
          <ProgressSteps current="checkout" />
          <article className="rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-xl">
            <p className="text-sm font-extrabold uppercase tracking-wide text-game-berry">Caja bloqueada</p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">La compra aun no es valida</h1>
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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff0eb_0%,#ffd6c7_32%,#f1a181_100%)] px-6 py-10 text-game-ink sm:px-10">
      <SceneDecorations variant="checkout" />
      <section className="relative mx-auto max-w-[80rem] space-y-6">
        <ProgressSteps current="checkout" />
        <section className="rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-xl">
          <p className="text-sm font-extrabold uppercase tracking-wide text-game-berry">Caja y pago</p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">Paga solo con el dinero disponible</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-game-ink/75">
            Michi Money tiene {formatCurrency(mission.budget)} para comprar y pagar. En caja solo puedes usar ese dinero y decidir bien como entregarlo.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <MetricCard label="Total a pagar" value={formatCurrency(missionState.total)} accent="orange" icon="cart" />
            <MetricCard label="Dinero entregado" value={formatCurrency(paymentState.paidAmount)} accent="rose" icon="wallet" />
            <MetricCard label="Dinero que te queda" value={formatCurrency(remainingWallet)} accent={remainingWallet > 0 ? "sky" : "stone"} icon="bill" />
            <MetricCard
              label={paymentState.isEnough ? "Cambio que recibes" : "Falta para pagar"}
              value={formatCurrency(paymentState.isEnough ? paymentState.change : paymentState.missingAmount)}
              accent={paymentState.isEnough ? "emerald" : "amber"}
              icon={paymentState.isEnough ? "check" : "cross"}
            />
          </div>

          <article className="mt-6 rounded-[1.5rem] bg-slate-50 p-6">
            <h2 className="font-heading text-xl font-bold text-game-ink">Cuentas de la caja</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-game-ink/50">Compra total</p>
                <p className="mt-1 font-heading text-lg font-bold text-game-ink">{formatCurrency(missionState.total)}</p>
                <p className="mt-1 text-sm text-game-ink/60">Eso es lo que cuestan los productos correctos.</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-game-ink/50">Dinero disponible</p>
                <p className="mt-1 font-heading text-lg font-bold text-game-ink">{formatCurrency(mission.budget)}</p>
                <p className="mt-1 text-sm text-game-ink/60">Este es el limite total que puedes usar en caja.</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-game-ink/50">Cuenta final</p>
                <p className="mt-1 font-heading text-lg font-bold text-game-ink">
                  {paymentState.paidAmount >= missionState.total
                    ? formatSubtractionEquation(paymentState.paidAmount, missionState.total, paymentState.change)
                    : formatSubtractionEquation(missionState.total, paymentState.paidAmount, paymentState.missingAmount)}
                </p>
                <p className="mt-1 text-sm text-game-ink/60">
                  {paymentState.paidAmount >= missionState.total ? "Asi descubres cuanto cambio recibes al terminar." : "Asi descubres cuanto dinero te falta para completar el pago."}
                </p>
              </div>
            </div>
          </article>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <aside className="space-y-4">
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
                    <span>Aun no has seleccionado dinero.</span>
                  )}
                </div>
              </article>
            </aside>

            <div className="space-y-4">
              <article className="rounded-[1.5rem] bg-slate-50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-game-ink">Dinero disponible para pagar</h2>
                    <p className="mt-2 text-base leading-7 text-game-ink/70">
                      Te quedan {formatCurrency(remainingWallet)} para completar el pago. No puedes usar mas del presupuesto de {formatCurrency(mission.budget)}.
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-game-ink shadow-sm">
                    Comparacion: {formatComparison(paymentState.paidAmount, missionState.total)}
                  </div>
                </div>

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

              <StatusBanner message={paymentState.statusMessage} tone={paymentSummaryTone} />

              <div className="flex flex-wrap gap-3">
                <ActionButton variant="danger" onClick={handleFinishPayment} disabled={!paymentState.isEnough}>Confirmar pago</ActionButton>
                <ActionButton variant="secondary" onClick={handleRemoveLastPayment} disabled={paymentHistory.length === 0}>Quitar ultimo monto</ActionButton>
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

