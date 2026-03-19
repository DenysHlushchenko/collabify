import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/types";
import qs from "query-string";

export function decodeToken(token: string): JwtPayload | null {
  return jwtDecode(token);
}

interface FormUrlQueryProps {
  params: string;
  key: string;
  value: string | null;
}

export function formUrlQuery({ params, key, value }: FormUrlQueryProps) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export function removeUrlQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

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

export function adjustText(text: string, length: number) {
  return text.length >= length ? `${text.substring(0, length)}...` : text;
}
