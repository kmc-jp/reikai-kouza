// プログラム内で使用する定数類
export const projectConstants = {
  slack: {
    memberChannelName: "#reikai-kouza",
    ownerChannelName: "#reikai-kouza-owner",
    logChannelName: "#reikai-kouza-log",
  },
  mysql: {
    DBName: "test_db",
    tableName: "reikai_kouza",
  },
  server: {
    port: 10080,
    path: {
      interactivity: "/interactivity",
    },
  },
  values: {
    preferredDayOfWeek: {
      Unanswered: {
        value: -1,
        text: "未回答",
      },
      Both: {
        value: 1,
        text: "どちらでも",
      },
      Monday: {
        value: 2,
        text: "月曜日",
      },
      Thursday: {
        value: 3,
        text: "木曜日",
      },
    },
    assignedDate: {
      None: -1,
    },
    announcementStatus: {
      Unassigned: 0,
      NoReply: 1,
      AdditionalAssignmentNeeded: 2,
      Postponed: 3,
      OK: 10,
    },
  },
  interactivity: {
    // Block ID, Action ID のそれぞれの値は一意である必要がある
    blockID: {
      dayOfWeekSelectSubmit: "id--day-of-week-submit",
      assignmentSelectSubmit: "id--assign-submit",
    },
    actionID: {
      dayOfWeekSelect: "id--day-of-week-select",
      assignmentSelect: "id--assign-select",
    },
    values: {
      dayOfWeekSelect: {
        Monday: "value--Monday",
        Thursday: "value--Thursday",
        Both: "value--Both",
      },
      assign: {
        OK: "value--postpone-OK",
        Postpone1: "value--postpone-1",
        Postpone2: "value--postpone-2",
        Postpone3: "value--postpone-3",
        Postpone4: "value--postpone-4",
        Cancel: "value--Cancel",
      },
    },
  },
};

export const tableItemName = {
  id: "id",
  registrationDate: "registration_date",
  preferredDayOfWeek: "preferred_day_of_week",
  assignedDate: "assigned_date",
  assignmentGroup: "assignment_group",
  announcedDate: "announced_date",
  announcementStatus: "announcement_status",
};
