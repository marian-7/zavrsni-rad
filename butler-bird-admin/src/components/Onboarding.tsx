import { FC, memo } from "react";
import style from "../styles/components/Onboarding.module.scss";
import { Typography } from "@material-ui/core";
import { Trans } from "react-i18next";
import { Info } from "pages/login/components/Info";
import classNames from "classnames";
import { useOrganizationQuery } from "hooks/useOrganizationQuery";

type Props = {
  form: any;
};

export const Onboarding: FC<Props> = memo(function Onboarding({ form }) {
  const { carousel } = useOnboarding();

  return (
    <div className={style.container}>
      <div
        className={classNames(
          style.form,
          "d-flex align-item-center justify-content-center"
        )}
      >
        {form}
        <div className={style.additionalInfo}>
          <Typography variant="body1">
            <Trans
              i18nKey="pages.login.additionalInfo"
              values={{ email: "info@butlerbird.com" }}
              components={{
                a: (
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    href="mailto:info@butlerbird.com"
                    className={style.anchor}
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          </Typography>
        </div>
      </div>
      <div
        className={classNames(
          style.info,
          "d-flex align-item-center justify-content-center flex-1"
        )}
      >
        <Info carousel={carousel} />
      </div>
    </div>
  );
});

function useOnboarding() {
  const { data: organization } = useOrganizationQuery();

  return { carousel: organization?.carousel };
}
