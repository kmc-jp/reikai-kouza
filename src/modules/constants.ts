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
  values: {
    preferredDayOfWeek: {
      Unanswered: -1,
      Both: 1,
      Monday: 2,
      Thursday: 3,
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
  }
}
