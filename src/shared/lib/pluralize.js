export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export function formatFichas(count) {
  return `${count} ${pluralize(count, "ficha")}`;
}
