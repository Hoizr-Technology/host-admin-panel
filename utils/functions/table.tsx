import { FilterDataEnum } from "@/generated/graphql";

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
