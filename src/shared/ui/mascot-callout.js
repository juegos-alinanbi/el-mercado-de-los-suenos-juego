import { EmojiIcon } from "@/shared/ui/emoji-icon";

export function MascotCallout({ title, description, accent = "amber", mood = "cat-neutral" }) {
  const accents = {
    amber: "bg-game-sun/15 border-game-sun",
    rose: "bg-game-berry/10 border-game-berry",
    emerald: "bg-game-grass/10 border-game-grass",
    coral: "bg-game-coral/10 border-game-coral",
    sky: "bg-game-sky/10 border-game-sky",
  };

  return (
    <div className={`relative rounded-[2rem] border-4 p-5 pl-24 ${accents[accent] ?? accents.amber}`}>
      <div className="absolute -left-3 -top-5 flex h-20 w-20 animate-float-bob items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
        <EmojiIcon name={mood} size={52} alt="Michi Money" />
      </div>
      <p className="text-sm font-extrabold uppercase tracking-wide text-game-ink/60">Michi Money te dice</p>
      <h3 className="mt-1 font-heading text-xl font-bold text-game-ink">{title}</h3>
      <p className="mt-2 text-base leading-7 text-game-ink/80">{description}</p>
    </div>
  );
}
