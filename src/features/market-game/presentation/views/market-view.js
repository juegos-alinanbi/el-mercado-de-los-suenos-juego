"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { evaluateMissionSelection } from "@/features/market-game/application/use-cases/evaluate-mission-selection";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { formatSumEquation } from "@/shared/lib/format-equation";
import { pluralize } from "@/shared/lib/pluralize";
import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { getProductIcon } from "@/shared/config/product-icons";
import { ActionButton } from "@/shared/ui/action-button";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
import { MascotCallout } from "@/shared/ui/mascot-callout";
import { MetricCard } from "@/shared/ui/metric-card";
import { ProductGlyph } from "@/shared/ui/product-glyph";
import { ProgressSteps } from "@/shared/ui/progress-steps";
import { SceneDecorations } from "@/shared/ui/scene-decorations";
import { StatusBanner } from "@/shared/ui/status-banner";

function toneForCategory(category) {
  if (category === "Frutas") return "emerald";
  if (category === "Bebidas") return "sky";
  if (category === "Lácteos") return "sky";
  return "amber";
}

export function MarketView() {
  const router = useRouter();
  const mission = useMarketGameStore((state) => state.mission);
  const products = useMarketGameStore((state) => state.products);
  const cartQuantities = useMarketGameStore((state) => state.cartQuantities);
  const incrementQuantity = useMarketGameStore((state) => state.incrementQuantity);
  const decrementQuantity = useMarketGameStore((state) => state.decrementQuantity);
  const clearCart = useMarketGameStore((state) => state.clearCart);
  const soundEnabled = useMarketGameStore((state) => state.soundEnabled);
  const productsShuffled = useMarketGameStore((state) => state.productsShuffled);
  const shuffleProductsIfNeeded = useMarketGameStore((state) => state.shuffleProductsIfNeeded);
  const sumAnswer = useMarketGameStore((state) => state.sumAnswer);
  const incrementSumAnswer = useMarketGameStore((state) => state.incrementSumAnswer);
  const decrementSumAnswer = useMarketGameStore((state) => state.decrementSumAnswer);
  const sumCheckResult = useMarketGameStore((state) => state.sumCheckResult);
  const sumAttempts = useMarketGameStore((state) => state.sumAttempts);
  const checkSumAnswer = useMarketGameStore((state) => state.checkSumAnswer);
  const { playClick, playCoin, playSuccess, playError } = useSoundEffects(soundEnabled);

  useEffect(() => {
    shuffleProductsIfNeeded();
  }, [shuffleProductsIfNeeded]);

  const missionState = evaluateMissionSelection(mission, products, cartQuantities);
  const isSumCorrect = sumCheckResult === "correct";
  const canGoCheckout = missionState.isReadyForCheckout && isSumCorrect;
  const bannerTone = missionState.isReadyForCheckout
    ? isSumCorrect
      ? "success"
      : "warning"
    : missionState.exceedsBudget || missionState.extraSelections.length > 0
      ? "danger"
      : "warning";
  const purchaseStateStyles = canGoCheckout
    ? {
        container: "border-game-grass/30 bg-game-grass/12",
        label: "text-game-grass",
        value: "text-game-grass",
      }
    : {
        container: "border-game-coral/30 bg-game-coral/10",
        label: "text-game-coral",
        value: "text-game-ink",
      };

  function handleIncrease(productId) {
    playCoin();
    incrementQuantity(productId);
  }

  function handleDecrease(productId, currentQuantity) {
    if (currentQuantity <= 0) {
      playError();
      return;
    }
    playClick();
    decrementQuantity(productId);
  }

  function handleClearCart() {
    playError();
    clearCart();
  }

  function handleGoCheckout() {
    if (!canGoCheckout) {
      playError();
      return;
    }
    playSuccess();
    router.push("/checkout");
  }

  function handleBackMission() {
    playClick();
    router.push("/mission");
  }

  function handleIncrementSum() {
    playCoin();
    incrementSumAnswer();
  }

  function handleDecrementSum() {
    if (sumAnswer <= 0) {
      playError();
      return;
    }
    playClick();
    decrementSumAnswer();
  }

  function handleCheckSum() {
    const isCorrect = sumAnswer === missionState.total;
    if (isCorrect) {
      playSuccess();
    } else {
      playError();
    }
    checkSumAnswer(missionState.total);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff0d6_0%,#ffd89c_28%,#efb16a_100%)] px-4 py-8 text-game-ink sm:px-8 lg:px-10 xl:px-12">
      <SceneDecorations variant="market" />
      <section className="relative mx-auto max-w-[104rem] space-y-6">
        <ProgressSteps current="market" />

        <section className="rounded-[2rem] border-4 border-white bg-white/90 p-6 shadow-xl sm:p-8 lg:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-game-coral">Mercado interactivo</p>
              <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">Elige justo lo que necesitas</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-game-ink/75">
                Cada decisión cambia el total y el presupuesto. Mira cómo la cantidad afecta el subtotal de cada producto.
              </p>
            </div>

            <div className={`rounded-[1.5rem] border-2 px-5 py-4 text-right ${purchaseStateStyles.container}`}>
              <p className={`text-sm font-bold uppercase tracking-wide ${purchaseStateStyles.label}`}>Estado de la compra</p>
              <p className={`mt-2 font-heading text-xl font-bold ${purchaseStateStyles.value}`}>
                {canGoCheckout ? "Lista para caja" : "Aún en revisión"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Total del carrito"
              value={missionState.cartItems.length > 0 && !isSumCorrect ? "$?" : formatCurrency(missionState.total)}
              accent="orange"
              icon="coin"
            />
            <MetricCard
              label="Dinero restante"
              value={formatCurrency(missionState.remainingBudget)}
              accent={missionState.remainingBudget < 0 ? "rose" : "emerald"}
              icon="wallet"
            />
            <MetricCard label="Productos seleccionados" value={`${missionState.cartItems.length}`} accent="amber" icon="cart" />
          </div>

          <div className="mt-8 flex flex-col gap-6 xl:max-h-[max(24rem,calc(100vh_-_24rem))] xl:flex-row">
            <div className="grid max-h-[max(24rem,min(96rem,calc(100vh_-_78rem)))] min-h-0 gap-4 overflow-y-auto pr-2 md:max-h-[max(24rem,min(47.5rem,calc(100vh_-_47rem)))] md:grid-cols-2 xl:max-h-[max(24rem,min(47.5rem,calc(100vh_-_32rem)))] xl:flex-[3.4]">
              {!productsShuffled
                ? products.map((product) => (
                    <div
                      key={product.id}
                      aria-hidden="true"
                      className="h-64 animate-pulse rounded-[1.75rem] border-4 border-slate-100 bg-slate-100 p-5 shadow-sm"
                    />
                  ))
                : products.map((product, index) => {
                    const quantity = cartQuantities[product.id] ?? 0;
                    const subtotal = product.price * quantity;

                    return (
                      <motion.article
                        key={product.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, delay: index * 0.04 }}
                        whileHover={{ y: -4 }}
                        className="rounded-[1.75rem] border-4 border-slate-100 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-4">
                            <ProductGlyph
                              icon={getProductIcon(product.id)}
                              name={product.name}
                              category={product.category}
                              tone={toneForCategory(product.category)}
                            />
                            <div>
                              <p className="text-sm font-bold uppercase tracking-wide text-game-ink/50">{product.category}</p>
                              <h2 className="mt-2 font-heading text-2xl font-bold text-game-ink">{product.name}</h2>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-base leading-7 text-game-ink/70">{product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="font-heading text-3xl font-bold text-game-grass">{formatCurrency(product.price)}</p>
                          <p className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-500">{quantity > 0 ? `${quantity} ${pluralize(quantity, "elegido", "elegidos")}` : "Sin elegir"}</p>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-game-ink/50">Cantidad</p>
                            <p className="mt-1 font-heading text-2xl font-bold text-game-ink">{quantity}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecrease(product.id, quantity)}
                              className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-slate-300 bg-white text-xl font-black text-game-ink transition active:translate-y-1 active:border-b-0"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => handleIncrease(product.id)}
                              className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-[#c7381f] bg-game-coral text-xl font-black text-white transition active:translate-y-1 active:border-b-0"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-base font-semibold text-game-ink/75">
                          <span>Subtotal</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                      </motion.article>
                    );
                  })}
            </div>

            <aside className="min-h-0 space-y-4 xl:flex-[2.2] xl:overflow-y-auto xl:pr-1">
              <MascotCallout
                title="Observa antes de avanzar"
                description="Si el total sube demasiado o aparece un producto extra, la misión deja de ser válida aunque el carrito se vea lleno."
                accent="amber"
                mood="thinking"
              />

              <article className="rounded-[1.5rem] bg-game-sun/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Revisión de la misión</h2>
                <div className="mt-4 space-y-3 text-base text-game-ink/80">
                  {missionState.objectiveChecks.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${
                        item.isMatched ? "bg-game-grass/15" : "bg-white/70"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-game-ink">{item.name}</p>
                        <p>Necesitas {item.requiredQuantity} y llevas {item.selectedQuantity}.</p>
                      </div>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          item.isMatched ? "bg-game-grass/25" : "bg-slate-100"
                        }`}
                      >
                        <EmojiIcon name={item.isMatched ? "check" : "cross"} size={20} />
                      </span>
                    </div>
                  ))}

                  {missionState.extraSelections.length > 0 ? (
                    <div className="rounded-2xl bg-game-berry/15 px-4 py-3 text-game-ink">
                      Tienes productos extra: {missionState.extraSelections.map((item) => item.name).join(", ")}.
                    </div>
                  ) : null}
                </div>

                <div className="mt-5">
                  <StatusBanner
                    message={
                      missionState.isReadyForCheckout && !isSumCorrect
                        ? "Los productos están correctos. Responde el total para poder avanzar."
                        : missionState.statusMessage
                    }
                    tone={bannerTone}
                  />
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-game-coral/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">¿Cuánto es el total?</h2>
                {missionState.cartItems.length > 0 ? (
                  <>
                    <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-right font-heading text-lg font-bold text-game-ink">
                      {isSumCorrect
                        ? formatSumEquation(
                            missionState.cartItems.map((item) => item.subtotal),
                            missionState.total,
                          )
                        : `${missionState.cartItems.map((item) => formatCurrency(item.subtotal)).join(" + ")} = ?`}
                    </p>

                    <div className="mt-4 flex w-fit items-center gap-3 rounded-2xl bg-white p-3">
                      <button
                        type="button"
                        onClick={handleDecrementSum}
                        className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-slate-300 bg-white text-xl font-black text-game-ink transition active:translate-y-1 active:border-b-0"
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-heading text-2xl font-bold text-game-ink">{formatCurrency(sumAnswer)}</span>
                      <button
                        type="button"
                        onClick={handleIncrementSum}
                        className="flex h-11 w-11 items-center justify-center rounded-full border-b-4 border-[#c7381f] bg-game-coral text-xl font-black text-white transition active:translate-y-1 active:border-b-0"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-4">
                      <ActionButton variant="success" onClick={handleCheckSum}>Comprobar</ActionButton>
                    </div>

                    <div className="mt-4">
                      <StatusBanner
                        message={
                          sumCheckResult === "correct"
                            ? "¡Correcto! Ya puedes avanzar a la caja."
                            : sumCheckResult === "incorrect"
                              ? sumAttempts === 1
                                ? "Revisa los subtotales antes de sumar."
                                : sumAttempts === 2
                                  ? "Suma producto por producto, uno a la vez."
                                  : `La respuesta correcta es ${formatCurrency(missionState.total)}. Ajusta el contador a ese número y presiona Comprobar.`
                              : "Ajusta el contador y presiona Comprobar cuando tengas tu respuesta."
                        }
                        tone={sumCheckResult === "correct" ? "success" : sumCheckResult === "incorrect" ? "warning" : "neutral"}
                      />
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-base text-game-ink/80">Agrega productos para calcular el total.</p>
                )}
              </article>

              <div className="flex flex-wrap gap-3">
                <ActionButton onClick={handleGoCheckout} disabled={!canGoCheckout}>Ir a caja</ActionButton>
                <ActionButton variant="secondary" onClick={handleClearCart}>Limpiar carrito</ActionButton>
                <ActionButton variant="secondary" onClick={handleBackMission}>Volver a misión</ActionButton>
              </div>
            </aside>
          </div>
        </section>
      </section>
    </main>
  );
}
