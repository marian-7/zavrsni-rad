import { Location } from "domain/models/Location";
import { Venue } from "domain/models/Venue";
import { uniq } from "lodash";

export function updateLocations(
  locations: Location[] | undefined,
  venue: Venue
) {
  if (!locations) {
    return [];
  }
  return locations.map((location) => {
    if (location.id === venue.location) {
      return {
        ...location,
        venues: uniq(location.venues.concat([venue.id])),
      };
    }
    return location;
  });
}
