export type tableStructure__ID = {
  id: string;
};

export type tableStructure__registrationDate = {
  registration_date: number;
};

export type tableStructure__preferredDayOfWeek = {
  preferred_day_of_week: number;
};

export type tableStructure__assignedDate = {
  assigned_date: number;
};

export type tableStructure__assignmentGroup = {
  assignment_group: number;
};

export type tableStructure__announcedDate = {
  announced_date: number;
};

export type tableStructure__announcementStatus = {
  announcement_status: number;
};

export type tableStructure = tableStructure__ID &
  tableStructure__registrationDate &
  tableStructure__preferredDayOfWeek &
  tableStructure__assignedDate &
  tableStructure__assignmentGroup &
  tableStructure__announcedDate &
  tableStructure__announcementStatus;
