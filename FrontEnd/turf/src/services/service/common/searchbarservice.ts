import { formatDate } from "../../constants/DateConstansts";

export const filterData = <
  T extends Record<string, any>
>(
  data: T[] = [],
  search = "",
  statusFilter = "",
  searchableFields: string[] = []
): T[] => {
  if (!Array.isArray(data)) return [];

  const normalize = (str: any) =>
    (str || "").toString().toLowerCase();

  const searchTerm = normalize(search).trim();
  const statusTerm = normalize(statusFilter).trim();

  return data.filter((item) => {
    const matchesStatus = statusTerm
      ? normalize(item.status) === statusTerm
      : true;

    const matchesSearch = searchTerm
      ? searchableFields.some((field) => {
          const value = item[field];
          if (!value) return false;

          if (field.toLowerCase().includes("date")) {
            const formattedDate = normalize(formatDate(value));
            const [day, month, year] = formattedDate.split("/");

            return (
              formattedDate.includes(searchTerm) ||
              searchTerm === day ||
              searchTerm === month ||
              year.includes(searchTerm)
            );
          }

          return normalize(value).includes(searchTerm);
        })
      : true;

    return matchesStatus && matchesSearch;
  });
};
