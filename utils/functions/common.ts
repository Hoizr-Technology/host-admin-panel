import {
  FilterDataEnum,
  RowsPerPageEnum,
  UserStatus,
} from "@/generated/graphql";
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  format,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  sub,
} from "date-fns";
import { useEffect, useRef } from "react";

export const formatWebsiteUrlClickable = (url: string) => {
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }
  return url;
};

// errorUtils.ts

export const extractErrorMessage = (error: any): string => {
  const errorJson = JSON.parse(JSON.stringify(error));
  if (
    errorJson &&
    errorJson.response &&
    errorJson.response.errors &&
    errorJson.response.errors[0].message
  ) {
    return errorJson.response.errors[0].message
      .toString()
      .replace("Error: ", "");
  } else {
    return error.toString();
  }
};

//Price Round Off

export const roundOffPrice = (price: number) => {
  const decimalPart = price % 1;

  if (decimalPart === 0) {
    return price;
  } else if (decimalPart < 0.5) {
    return Math.floor(price) + 0.49;
  } else {
    return Math.floor(price) + 0.99;
  }
};

// CHECK FOR VALID NAME

export const isValidNameAlphabetic = (name: string) => {
  const regex = /^[a-zA-Z0-9\s-]+$/;
  return regex.test(name);
};

// GENERATE DUPLICATE NAMES FOR MENU BUILDER

export const generateUniqueName = (baseName: string): string => {
  const nameWithoutSuffix = baseName.replace(/\s*-copy(\d*)\s*$/, "").trim();

  const hasCopySuffix = /-copy(\d*)$/.test(baseName);

  if (!hasCopySuffix) {
    return `${nameWithoutSuffix}-copy`;
  }

  const currentSuffix = (baseName.match(/-copy(\d*)$/) || [])[1];
  const nextSuffix = currentSuffix ? parseInt(currentSuffix, 10) + 1 : 2;

  return `${nameWithoutSuffix}-copy${nextSuffix}`;
};

// HIDE/HASH PERSONAL INFORMATION

export const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return local.replace(/.(?=.{3})/g, "*") + "@" + domain;
};

export const maskNumber = (phone: string) => {
  return phone.replace(/\d(?=\d{4})/g, "*");
};

// export const maskEIN = (ein: string) => {
//   return ein.replace(/\d{4}$/, "****");
// };

export const formatSelectedItemPerPage = (
  selectedItemPerPage: RowsPerPageEnum
): number => {
  switch (selectedItemPerPage) {
    case RowsPerPageEnum.Ten:
      return 10;
    case RowsPerPageEnum.Thirty:
      return 30;
    case RowsPerPageEnum.Fifty:
      return 50;
    default:
      return 10; // Default value
  }
};

export const getPageSizeNumber = (pageSize: RowsPerPageEnum) => {
  switch (pageSize) {
    case RowsPerPageEnum.Ten:
      return 10;
    case RowsPerPageEnum.Thirty:
      return 30;
    case RowsPerPageEnum.Fifty:
      return 50;

    default:
      return 10;
  }
};

export const getPageSizeEnum = (size: number) => {
  switch (size) {
    case 10:
      return RowsPerPageEnum.Ten;
    case 30:
      return RowsPerPageEnum.Thirty;
    case 50:
      return RowsPerPageEnum.Fifty;

    default:
      return RowsPerPageEnum.Ten;
  }
};

export const formatUserStatus = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.Active:
      return "Active";
    case UserStatus.Blocked:
      return "Blocked";

    default:
      return "";
  }
};

export const formatUserRole = (role: string): string => {
  switch (role) {
    case "owner":
      return "Owner";
    case "staff":
      return "Staff";
    case "manager":
      return "Manager";
    case "marketingPartner":
      return "Marketing Partner";

    default:
      return "";
  }
};

export const sanitizeText = (text: string): string => {
  let sanitizedText = "";
  if (text) {
    sanitizedText = text.trim();
  }

  return sanitizedText;
};

export const getClickableUrlLink = (link: string) => {
  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `https://${link}`;
};

/**
 * Formats a number to a maximum of 2 decimal places.
 * If the value is not a valid number, it returns 0.00.
 * @param value - The number to be formatted
 * @returns - The formatted number as a float
 */
export const formatNumberToMax2 = (value: number): number => {
  if (isNaN(value)) {
    return 0;
  }
  return parseFloat(value.toFixed(2));
};

export const parseHtmlWithValues = (
  html: string,
  values: Record<string, string>,
  keysToReplace: string[]
) => {
  // Create a Set of keys to replace for quick lookup
  const replaceKeys = new Set(keysToReplace);

  // Use regex to find placeholders
  return html.replace(/{{(.*?)}}/g, (match, variable) => {
    const trimmedVariable = variable.trim();

    // Check if the variable is in the list to replace
    if (
      replaceKeys.has(trimmedVariable) &&
      values[trimmedVariable] !== undefined
    ) {
      return values[trimmedVariable];
    }

    // If not replacing, return the placeholder as-is
    return match;
  });
};

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}

export const areObjectsEqual = <T extends Record<string, any>>(
  obj1: T,
  obj2: T
): boolean => {
  // Check if both objects have the same keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if every key in obj1 has the same value in obj2
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (key === "domainConfig") continue;

    // Check if values are objects or arrays, recursively compare
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) {
        return false;
      }
      for (let i = 0; i < val1.length; i++) {
        if (typeof val1[i] === "object" && typeof val2[i] === "object") {
          if (!areObjectsEqual(val1[i], val2[i])) {
            return false;
          }
        } else if (val1[i] !== val2[i]) {
          return false;
        }
      }
    } else if (
      typeof val1 === "object" &&
      typeof val2 === "object" &&
      val1 !== null &&
      val2 !== null
    ) {
      if (!areObjectsEqual(val1, val2)) {
        return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
};

/**
 * Calculates start and end dates based on a given MetricsDataRange
 * @param range MetricsDataRange enum value
 * @returns Object containing start and end dates
 */

interface DateRange {
  start: Date;
  end: Date;
}

export const formatFilterOperation = (value: FilterDataEnum) => {
  switch (value) {
    case FilterDataEnum.Contains:
      return "Contains";
    case FilterDataEnum.Equals:
      return "Equals";
    case FilterDataEnum.NotEquals:
      return "Not Equals";
    // case FilterDataEnum.InArray:
    //   return "In List";
    // case FilterDataEnum.NotInArray:
    //   return "Not In List";
    case FilterDataEnum.GreaterThan:
      return "Greater Than";
    case FilterDataEnum.LessThan:
      return "Less Than";
    default:
      return "";
  }
};

export const base64Encode = (str: Buffer) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const formatDateToReportObject = (date: Date | null) => {
  if (!date) return null;
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isEmailContentValid(design: {
  body: { rows: { columns: { contents: any[] }[] }[] };
}): boolean {
  const rows = design?.body?.rows;
  if (!rows || rows.length === 0) return false;

  for (const row of rows) {
    if (row.columns?.some((col) => col.contents && col.contents.length > 0)) {
      return true;
    }
  }

  return false;
}
