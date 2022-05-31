const challenge = {
  token: "ABCDEFGHIJKLMNOPQRSTUVWX",
  challenge: "ABCDEFGHIJKLMNOPQRSTUVWXABCDEFGHIJKLMNOPQRSTUVWX1234",
  type: "url_verification",
};

const appHomeOpened = {
  token: "ABCDEFGHIJKLMNOPQRSTUVWX",
  team_id: "T0321RSJ5",
  api_app_id: "A02LFFDF8RG",
  event: {
    type: "app_home_opened",
    user: "U01U7S3UFAB",
    channel: "D02LVVDJQEQ",
    tab: "home",
    event_ts: "1650206346.788405",
  },
  type: "event_callback",
  event_id: "Ev03BV75LXLL",
  event_time: 1650206346,
  authorizations: [
    {
      enterprise_id: null,
      team_id: "T0321RSJ5",
      user_id: "U02L8PYDEK0",
      is_bot: true,
      is_enterprise_install: false,
    },
  ],
  is_ext_shared_channel: false,
};

type _challengeTypeBase = typeof challenge;

export type _challengeType = _challengeTypeBase & {
  type: "url_verification";
};

type _appHomeOpenedTypeBase = typeof appHomeOpened;

export type _appHomeOpenedType = _appHomeOpenedTypeBase & {
  event: {
    type: "app_home_opened";
    tab: "home";
  };
  type: "event_callback";
};
