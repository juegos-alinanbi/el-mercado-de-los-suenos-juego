"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { evaluateMissionSelection } from "@/features/market-game/application/use-cases/evaluate-mission-selection";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { formatSumEquation } from "@/shared/lib/format-equation";
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
  if (category === "Lacteos") return "sky";
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
  const { playClick, playCoin, playSuccess, playError } = useSoundEffects(soundEnabled);

  const missionState = evaluateMissionSelection(mission, products, cartQuantities);
  const objectiveMap = new Map(mission.objectives.map((objective) => [objective.id, objective.quantity]));
  const bannerTone = missionState.isReadyForCheckout
    ? "success"
    : missionState.exceedsBudget || missionState.extraSelections.length > 0
      ? "danger"
      : "warning";
  const purchaseStateStyles = missionState.isReadyForCheckout
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
    if (!missionState.isReadyForCheckout) {
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff0d6_0%,#ffd89c_28%,#efb16a_100%)] px-6 py-10 text-game-ink sm:px-10">
      <SceneDecorations variant="market" />
      <section className="relative mx-auto max-w-[96rem] space-y-6">
        <ProgressSteps current="market" />

        <section className="rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-game-coral">Mercado interactivo</p>
              <h1 className="mt-4 font-heading text-4xl font-bold text-game-ink">Elige justo lo que necesitas</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-game-ink/75">
                Cada decision cambia el total y el presupuesto. Mira como la cantidad afecta el subtotal de cada producto.
              </p>
            </div>

            <div className={`rounded-[1.5rem] border-2 px-5 py-4 text-right ${purchaseStateStyles.container}`}>
              <p className={`text-sm font-bold uppercase tracking-wide ${purchaseStateStyles.label}`}>Estado de la compra</p>
              <p className={`mt-2 font-heading text-xl font-bold ${purchaseStateStyles.value}`}>
                {missionState.isReadyForCheckout ? "Lista para caja" : "Aun en revision"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetricCard label="Total del carrito" value={formatCurrency(missionState.total)} accent="orange" icon="coin" />
            <MetricCard
              label="Dinero restante"
              value={formatCurrency(missionState.remainingBudget)}
              accent={missionState.remainingBudget < 0 ? "rose" : "emerald"}
              icon="wallet"
            />
            <MetricCard label="Productos seleccionados" value={`${missionState.cartItems.length}`} accent="amber" icon="cart" />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product, index) => {
                const quantity = cartQuantities[product.id] ?? 0;
                const subtotal = product.price * quantity;
                const requiredQuantity = objectiveMap.get(product.id) ?? 0;
                const isRequired = requiredQuantity > 0;
                const isMatched = quantity === requiredQuantity && isRequired;

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                    className={`rounded-[1.75rem] border-4 bg-white p-5 shadow-sm ${
                      isMatched ? "border-game-grass" : isRequired ? "border-game-sun" : "border-slate-100"
                    }`}
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

                      {isRequired ? (
                        <span className={`rounded-full px-3 py-1 text-sm font-bold ${isMatched ? "bg-game-grass/20 text-game-grass" : "bg-game-sun/25 text-game-ink"}`}>
                          Meta: {requiredQuantity}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">Opcional</span>
                      )}
                    </div>

                    <p className="mt-3 text-base leading-7 text-game-ink/70">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-heading text-3xl font-bold text-game-grass">{formatCurrency(product.price)}</p>
                      <p className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-500">{quantity > 0 ? `${quantity} elegidos` : "Sin elegir"}</p>
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
                    {isRequired ? (
                      <p className="mt-2 text-sm font-semibold text-game-ink/50">
                        Aprendes: {requiredQuantity} x {formatCurrency(product.price)} forma parte del total.
                      </p>
                    ) : null}
                  </motion.article>
                );
              })}
            </div>

            <aside className="space-y-4">
              <MascotCallout
                title="Observa antes de avanzar"
                description="Si el total sube demasiado o aparece un producto extra, la mision deja de ser valida aunque el carrito se vea lleno."
                accent="amber"
                mood="thinking"
              />

              <article className="rounded-[1.5rem] bg-game-coral/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Resumen del carrito</h2>
                <div className="mt-5 space-y-3 text-base text-game-ink/80">
                  {missionState.cartItems.length > 0 ? (
                    <>
                      {missionState.cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3">
                          <span className="flex items-center gap-2">
                            <EmojiIcon name={getProductIcon(item.id)} size={22} />
                            {item.quantity} x {item.name}
                          </span>
                          <strong>{formatCurrency(item.subtotal)}</strong>
                        </div>
                      ))}
                      <div className="rounded-2xl bg-white px-4 py-3 text-right font-heading text-lg font-bold text-game-ink">
                        {formatSumEquation(
                          missionState.cartItems.map((item) => item.subtotal),
                          missionState.total,
                        )}
                      </div>
                    </>
                  ) : (
                    <p>Aun no has seleccionado productos.</p>
                  )}
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-game-sun/10 p-6">
                <h2 className="font-heading text-xl font-bold text-game-ink">Revision de la mision</h2>
                <div className="mt-4 space-y-3 text-base text-game-ink/80">
                  {missionState.objectiveChecks.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white/70 px-4 py-3">
                      <p className="font-bold text-game-ink">{item.name}</p>
                      <p>Necesitas {item.requiredQuantity} y llevas {item.selectedQuantity}.</p>
                    </div>
                  ))}

                  {missionState.extraSelections.length > 0 ? (
                    <div className="rounded-2xl bg-game-berry/15 px-4 py-3 text-game-ink">
                      Tienes productos extra: {missionState.extraSelections.map((item) => item.name).join(", ")}.
                    </div>
                  ) : null}
                </div>

                <div className="mt-5">
                  <StatusBanner message={missionState.statusMessage} tone={bannerTone} />
                </div>
              </article>

              <div className="flex flex-wrap gap-3">
                <ActionButton onClick={handleGoCheckout} disabled={!missionState.isReadyForCheckout}>Ir a caja</ActionButton>
                <ActionButton variant="secondary" onClick={handleClearCart}>Limpiar carrito</ActionButton>
                <ActionButton variant="secondary" onClick={handleBackMission}>Volver a mision</ActionButton>
              </div>
            </aside>
          </div>
        </section>
      </section>
    </main>
  );
}
