// ============================================================
//  husbindos. — site configuration
//  Edit the values below; nothing else needs to change.
// ============================================================
window.HUSBINDOS = {
  // Apps Script Web App URL (ends in /exec). Leave "" until deployed —
  // the forms will show a friendly "not open yet" message.
  API_URL: "",

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
