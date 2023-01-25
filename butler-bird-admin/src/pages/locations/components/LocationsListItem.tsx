import { FC, memo } from "react";
import { LinkButton } from "components/LinkButton";
import { Typography } from "@material-ui/core";
import { Location } from "domain/models/Location";
import { getLabel } from "domain/util/text";
import { Organization } from "domain/models/Organization";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import { paths, withSlug } from "paths";
import listItemStyle from "styles/components/ListItem.module.scss";
import classNames from "classnames";
import style from "styles/pages/locations/components/LocationsListItem.module.scss";

type Props = {
  location: Location;
  organization: Organization;
};

export const LocationsListItem: FC<Props> = memo(function LocationsListItem({
  location,
  organization,
}) {
  useLocationsListItem();

  return (
    <li>
      <LinkButton
        to={withSlug(paths.location(location.id))}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        <Typography className={classNames(listItemStyle.title, style.title)}>
          {getLabel(location.name, organization.languages)}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          <Typography className={listItemStyle.label}>
            {location.address}
          </Typography>
          <ArrowIcon className={style.arrowIcon} />
        </div>
      </LinkButton>
    </li>
  );
});

function useLocationsListItem() {
  return {};
}
