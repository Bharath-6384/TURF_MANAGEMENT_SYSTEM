export const formatDate = (dateString: string) => {
  if (!dateString) return "-"; 
  try {
    return new Date(dateString).toLocaleDateString("en-GB");
  } catch (error) {
    console.error("Invalid date:", dateString);
    return "-";
  }
};
