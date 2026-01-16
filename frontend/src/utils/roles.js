export const getRole = () => {
  return localStorage.getItem("role") || "student";
};

export const canWrite = () => {
  const role = getRole();
  return role === "admin" || role === "staff";
};

export const canManageAcademic = () => {
  const role = getRole();
  return role === "admin" || role === "staff" || role === "teacher";
};

export const isAdmin = () => {
  return getRole() === "admin";
};
