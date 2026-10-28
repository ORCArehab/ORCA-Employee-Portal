/**
 * ORCA's facilities map, linked (not embedded) from /facilities. This is a
 * Google Maps "Shared list," not a My Maps custom map — Google doesn't
 * offer an embeddable iframe URL for lists (X-Frame-Options blocks it), so
 * this is a link-out rather than an iframe like the old map was.
 */
export const facilitiesMap = {
  url: "https://maps.app.goo.gl/jjKugpHVzV1kkhnc9",
};

// The facility list itself comes live from the ORCA API (src/lib/orgDirectory.ts).
