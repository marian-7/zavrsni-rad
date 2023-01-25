import React, { FC, memo } from "react";
import { Venue } from "domain/models/Venue";
import { LinkButton } from "components/LinkButton";
import { Typography } from "@material-ui/core";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import listItemStyle from "styles/components/ListItem.module.scss";
import style from "styles/pages/venues/components/VenueListItem.module.scss";
import { paths, withSlug } from "paths";
import classNames from "classnames";
import { Organization } from "domain/models/Organization";
import { Location } from "domain/models/Location";
import { getLabel } from "domain/util/text";

interface Props {
  venue: Venue;
  organization: Organization;
  location: Location;
}

export const VenueListItem: FC<Props> = memo(function VenueListItem(props) {
  useVenueListItem();
  const { venue, organization, location } = props;

  return (
    <li>
      <LinkButton
        to={withSlug(paths.venue(venue.id))}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        <Typography className={classNames(listItemStyle.title, style.title)}>
          {getLabel(venue.name, organization.languages)}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          {location && (
            <Typography className={listItemStyle.label}>
              {getLabel(location?.name, organization.languages)}
            </Typography>
          )}
          <ArrowIcon className={listItemStyle.icon} />
        </div>
      </LinkButton>
    </li>
  );
});

function useVenueListItem() {}
