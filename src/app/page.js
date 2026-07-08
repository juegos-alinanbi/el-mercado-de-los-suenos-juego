import { LevelPicker } from "@/features/market-game/presentation/components/level-picker";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
import { ProductGlyph } from "@/shared/ui/product-glyph";
import { SceneDecorations } from "@/shared/ui/scene-decorations";

const missionItems = [
  { icon: "bread", name: "Pan", detail: "2 unidades", price: "$2 c/u", tone: "amber" },
  { icon: "milk", name: "Leche", detail: "1 unidad", price: "$3", tone: "sky" },
  { icon: "apple", name: "Manzana", detail: "1 unidad", price: "$1", tone: "emerald" },
];

const learningHighlights = [
  { icon: "abacus", title: "Suma y resta" },
  { icon: "coin", title: "Presupuesto y cambio" },
  { icon: "cart", title: "Compra guiada" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#effaff_0%,#d8f0ff_34%,#acdfff_100%)] px-5 py-6 text-game-ink sm:px-8 lg:px-10 lg:py-8">
      <SceneDecorations variant="home" />

      <div className="pointer-events-none absolute left-[6%] top-28 hidden animate-float-bob lg:block">
        <EmojiIcon name="balloon" size={52} />
      </div>
      <div className="pointer-events-none absolute right-[8%] top-24 hidden animate-float-bob lg:block" style={{ animationDelay: "0.8s" }}>
        <EmojiIcon name="star" size={44} />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <article className="text-center lg:text-left">
            <span className="inline-flex rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-game-sky shadow-sm sm:text-sm">
              El Mercado de los Sueños
            </span>

            <div className="mx-auto mt-5 flex h-28 w-28 animate-float-bob items-center justify-center rounded-full border-[6px] border-white bg-white shadow-[0_20px_40px_rgba(36,34,90,0.16)] sm:h-32 sm:w-32 lg:mx-0 lg:h-36 lg:w-36">
              <EmojiIcon name="cat-happy" size={84} alt="Michi Money" />
            </div>

            <h1
              className="mt-5 font-heading text-4xl font-bold leading-none text-game-ink sm:text-5xl lg:max-w-xl lg:text-7xl"
              style={{ textShadow: "3px 4px 0 rgba(36,34,90,0.12)" }}
            >
              Michi Money en el Mercado
            </h1>

            <span className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-game-grass/35 bg-game-grass/10 px-4 py-1.5 text-sm font-extrabold text-game-grass lg:mx-0">
              <EmojiIcon name="star" size={16} />
              Para niños de 10 años en adelante
            </span>

            <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-game-ink/80 sm:text-xl lg:mx-0">
              Compra, calcula y paga sin pasarte del presupuesto en una aventura corta, colorida y fácil de entender.
            </p>

            <LevelPicker />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {learningHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.35rem] border border-white/80 bg-white/72 px-4 py-4 shadow-[0_10px_25px_rgba(36,34,90,0.08)] backdrop-blur-sm"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-game-sky/10 lg:mx-0">
                    <EmojiIcon name={item.icon} size={24} />
                  </div>
                  <p className="mt-3 text-sm font-extrabold leading-6 text-game-ink lg:text-base">{item.title}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-4 top-10 hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-game-ink shadow-lg lg:block">
              Presupuesto: $10
            </div>
            <div className="absolute -right-4 bottom-12 hidden rounded-full bg-game-sun px-4 py-2 text-sm font-bold text-game-ink shadow-lg lg:block">
              Cambio esperado: $2
            </div>

            <article className="relative overflow-hidden rounded-[2.3rem] border-4 border-white/85 bg-white/88 p-5 shadow-[0_24px_60px_rgba(56,102,160,0.2)] backdrop-blur-sm sm:p-6 lg:p-7">
              <div className="absolute right-5 top-5 rounded-full bg-game-sun/20 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-game-ink/70">
                Nivel básico
              </div>

              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-game-coral">Misión destacada</p>
              <h2 className="mt-3 max-w-sm font-heading text-3xl font-bold text-game-ink sm:text-4xl">
                Ayuda a Michi Money a comprar la merienda
              </h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-game-ink/75">
                Compra 2 panes, 1 leche y 1 manzana sin pasar de $10. Elige bien las cantidades y llega listo a la caja.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {missionItems.map((item) => (
                  <div key={item.name} className="rounded-[1.5rem] bg-slate-50 px-4 py-4 text-center shadow-sm">
                    <div className="flex justify-center">
                      <ProductGlyph icon={item.icon} name={item.name} category={item.detail} tone={item.tone} />
                    </div>
                    <p className="mt-3 text-base font-extrabold text-game-ink">{item.name}</p>
                    <p className="text-sm font-semibold text-game-ink/65">{item.detail}</p>
                    <p className="mt-1 text-sm font-bold text-game-coral">{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.7rem] bg-gradient-to-r from-game-grass/12 via-game-sky/12 to-game-sun/18 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-3 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <EmojiIcon name="wallet" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-game-berry">Así se aprende jugando</p>
                    <p className="mt-1 text-lg font-bold leading-7 text-game-ink">
                      Elige bien las cantidades, calcula el total de tu compra y descubre cuánto cambio recibes al pagar.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}

