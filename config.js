// ============================================================
//  husbindos. — site configuration
//  Edit the values below; nothing else needs to change.
// ============================================================
window.HUSBINDOS = {
  // ---- Notes & registry backend: Google Forms + a published Sheet tab ----
  // Submissions post straight into the Google Forms below (which feed the Sheet
  // "husbindos. — Notes & Registry"). The public wall reads the "Public" tab,
  // published as CSV. Hide a note by setting its "Show" cell to FALSE.
  NOTES_FORM: {
    action: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScZs2ffdSJ8R7f0gO8v2HVmTmkm7Ek8zwDVkPtQB3eWXA2sXQ/formResponse",
    fields: { name: "entry.1752154234", message: "entry.1806787441" }
  },
  REGISTRY_FORM: {
    action: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd_FLNwz5Bc8lvL9o_XElgvBuBiFUJqeRkZCZQDKQaqUu-tAw/formResponse",
    fields: { name: "entry.1514671729", email: "entry.667598543", gift: "entry.1822823525", link: "entry.1281548187", message: "entry.1449450496" }
  },
  NOTES_CSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLbVmzYcBJKo_GoVJYWr32DPc0KT2yQuBE3v71zF0PBHOTlLrfUkhym0JP_THr09lvCYkeo9YeL6TR/pub?gid=0&single=true&output=csv",

  // Google Drive folder where guests drop their photos.
  // Sharing must be: Anyone with the link → Editor (or Contributor).
  GUEST_UPLOAD_FOLDER_ID: "1G9vUavgxpsJAIedVrhUkQNQeDDSthM_i",

  // Google Drive folder with the photographer's pictures.
  // Sharing must be: Anyone with the link → Viewer.
  PHOTOGRAPHER_FOLDER_ID: "1LOSR8hQgdif0-hO8hwVlIpYNmBWEkted",

  // Optional: a hand-picked list of image URLs for the featured gallery
  // (direct links, e.g. from Drive "https://lh3.googleusercontent.com/d/FILE_ID"
  // or any host). Leave empty to show the Drive folder grid instead.
  PHOTOGRAPHER_IMAGES: [],

  // Toggle once the photographer has delivered.
  PHOTOGRAPHER_READY: false,

  // YouTube video ID (the part after v= in the URL). Leave "" until the film is out.
  VIDEO_YOUTUBE_ID: "",

  // Original registry link (shown on the Registry page). Leave "" to hide.
  REGISTRY_URL: "",

  // The card artwork (plum paper + gold peacocks) from the Paperless Post invite.
  // The site first tries the local copy at site/assets/card.jpg; if that file
  // isn't there it falls back to this URL. Save the image locally when you can —
  // Paperless Post could retire the asset one day.
  CARD_ART_URL: "https://assets.ppassets.com/p-1JGwbVHfNAIUJyxWRv1PDK/flyer/paper_static/base",

  // Where the Paperless Post invite lives.
  INVITE_URL: "https://pp.events/husbindos",

  // Couple + event details
  NAMES: ["Jay", "Albert"],
  DATE_LONG: "September 19, 2026",
  VENUE: "Universitat de Barcelona",
  CITY: "Barcelona"
};
