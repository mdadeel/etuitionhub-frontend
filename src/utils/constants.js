// common constants - avoid typos in role/status checks
// bhaiya suggested this pattern for consistency

export const ROLES = {
  STUDENT: "student",
  TUTOR: "tutor",
  ADMIN: "admin",
};

export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed", // payment status
};

// medium options for tuition posting
export const MEDIUMS = {
  BANGLA: "Bangla Medium",
  ENGLISH: "English Medium",
  CAMBRIDGE: "Cambridge",
  IB: "IB",
};

export const MEDIUM_OPTIONS = Object.values(MEDIUMS);

export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export const SUBJECT_OPTIONS = [
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "Higher Math",
  "General Science",
  "ICT",
  "Accounting",
  "Finance",
  "Economics",
  "History",
  "Geography",
];

export const GENDER_OPTIONS = ["Male", "Female", "Other"];

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "bangla", label: "Bangla" },
  { value: "both", label: "Both" },
];

export const WEEK_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
