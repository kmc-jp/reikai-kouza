// プログラム内で使用する定数類
export const projectConstants = {
  slack: {
    memberChannelName: "#reikai-kouza-member",
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
    }
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
    }
  },
  interactivity: {
    blockID: {
      dayOfWeekSelectSubmit: "id--day-of-week-submit",
    },
    actionID: {
      dayOfWeekSelect: "id--day-of-week-select",
    },
    values: {
      dayOfWeekSelect: {
        Monday: "value--Monday",
        Thursday: "value--Thursday",
        Both: "value--Both",
      },
    },
  },
}
