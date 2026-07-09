const ICONS = {
  bread: "/icons/bread.svg",
  milk: "/icons/glass-of-milk.svg",
  apple: "/icons/red-apple.svg",
  juice: "/icons/tropical-drink.svg",
  cookie: "/icons/cookie.svg",
  cheese: "/icons/cheese-wedge.svg",
  banana: "/icons/banana.svg",
  carrot: "/icons/carrot.svg",
  egg: "/icons/egg.svg",
  "chocolate-bar": "/icons/chocolate-bar.svg",
  "cat-neutral": "/icons/cat-face.svg",
  "cat-happy": "/icons/grinning-cat-with-smiling-eyes.svg",
  "cat-worried": "/icons/weary-cat.svg",
  thinking: "/icons/thinking-face.svg",
  celebrate: "/icons/partying-face.svg",
  coin: "/icons/coin.svg",
  bill: "/icons/dollar-banknote.svg",
  wallet: "/icons/money-bag.svg",
  cart: "/icons/shopping-cart.svg",
  bags: "/icons/shopping-bags.svg",
  check: "/icons/check-mark-button.svg",
  cross: "/icons/cross-mark.svg",
  sparkles: "/icons/sparkles.svg",
  party: "/icons/party-popper.svg",
  star: "/icons/glowing-star.svg",
  balloon: "/icons/balloon.svg",
  trophy: "/icons/trophy.svg",
  cloud: "/icons/cloud.svg",
  sun: "/icons/sun-with-face.svg",
  rainbow: "/icons/rainbow.svg",
  "shooting-star": "/icons/shooting-star.svg",
  confetti: "/icons/confetti-ball.svg",
  tent: "/icons/circus-tent.svg",
  clover: "/icons/four-leaf-clover.svg",
  abacus: "/icons/abacus.svg",
  lock: "/icons/locked.svg",
};

export function EmojiIcon({ name, size = 40, className = "", alt = "" }) {
  const src = ICONS[name];

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
