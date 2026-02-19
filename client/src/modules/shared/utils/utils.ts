export function convertToDateString(date: Date): string {
  const parts = new Date(date).toDateString().split(" ");
  const year = parts[3];
  const day = parts[2];
  const month = parts[1];
  return `${day} ${month}, ${year}`;
}

export function convertNameToInitial(name: string | undefined): string {
  return name ? name.charAt(0).toUpperCase() : "";
}
