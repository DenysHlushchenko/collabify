export function convertToDateString(date: Date): string {
  const now = new Date();
  const receivedDate = new Date(date);
  const timeDifference = now.getTime() - receivedDate.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    return receivedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}

export function convertNameToInitial(name: string | undefined): string {
  return name ? name.charAt(0).toUpperCase() : "";
}
