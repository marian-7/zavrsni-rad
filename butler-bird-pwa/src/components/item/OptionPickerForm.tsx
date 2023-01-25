import React, { FC, memo, useCallback, useMemo } from "react";
import { OptionGroup } from "domain/types/OptionGroup";
import { ItemOptionGroup } from "components/item/ItemOptionGroup";
import style from "styles/components/item/option-picker-form.module.scss";
import { Form, useFormikContext } from "formik";
import Typography from "@material-ui/core/Typography";
import { isEmpty, keyBy } from "lodash";
import { useMenu } from "hooks/useMenu";
import { useRouter } from "next/router";
import { Button } from "components/Button";
import { ReactComponent as NoImage } from "assets/icons/no-image.svg";
import { useTranslation } from "next-i18next";
import { ItemOptions } from "components/item/ItemDialog";
import { getFormattedPrice, getItemPrice } from "domain/util/price";
import { useCurrency } from "hooks/useCurrency";
import { getLabel } from "domain/util/text";
import { FormikQuantity } from "components/formik/FormikQuantity";
import { getImage, ImageFormat } from "domain/util/getImage";
import { Option } from "domain/types/Option";
import { useTable } from "hooks/useTable";
import { OrganizationMode } from "domain/types/Organization";
import { useBanner } from "hooks/useBanner";
import { Banner } from "components/Banner";

type Props = {};

export const OptionPickerForm: FC<Props> = memo(function OptionPickerForm() {
  const {
    item,
    tagsAsText,
    locale,
    isValid,
    coefficient,
    currency,
    price,
    table,
    closeBanner,
    showBanner,
    bannerMessage,
  } = useOptionPickerForm();
  const { t } = useTranslation("menu");

  const renderOptionGroups = useCallback((optionGroup: OptionGroup) => {
    return <ItemOptionGroup key={optionGroup.id} optionGroup={optionGroup} />;
  }, []);

  if (!item) {
    return null;
  }

  const { name, description, image, optionGroups, longDescription } = item;

  return (
    <Form className={style.form}>
      <div className={style.root}>
        {bannerMessage && showBanner && (
          <Banner message={bannerMessage} closeBanner={closeBanner} />
        )}
        <div className={style.padding}>
          {image ? (
            <div className={style.imageContainer}>
              <img
                src={getImage(image, ImageFormat.Large)}
                alt={name[locale!]}
                className={style.image}
              />
            </div>
          ) : (
            <NoImage className={style.placeholder} />
          )}
          <Typography className={style.bold}>{getLabel(name, locale!)}</Typography>
          <Typography className="mb-1">{getLabel(description, locale!)}</Typography>
          {longDescription && !isEmpty(longDescription) && (
            <Typography className="mb-2">{getLabel(longDescription, locale!)}</Typography>
          )}
          {tagsAsText && (
            <>
              <Typography className={style.bold}>{t("tags")}</Typography>
              <Typography className="mb-2">{tagsAsText}</Typography>
            </>
          )}
          {optionGroups?.map(renderOptionGroups)}
        </div>
        {table?.mode !== OrganizationMode.View && (
          <div className={style.controls}>
            {isValid ? (
              <>
                <FormikQuantity name="quantity" />
                <Button color="primary" variant="contained" type="submit" className={style.add}>
                  {t("button.add", {
                    price: getFormattedPrice(price ?? 0, locale!, currency, coefficient),
                  })}
                </Button>
              </>
            ) : (
              <Typography className={style.text}>{t("requiredOptions")}</Typography>
            )}
          </div>
        )}
      </div>
    </Form>
  );
});

function useOptionPickerForm() {
  const { locale } = useRouter();
  const { item, tags, bannerMessage } = useMenu();
  const { showBanner, closeBanner } = useBanner();
  const { isValid, values } = useFormikContext<ItemOptions>();
  const { coefficient, currency } = useCurrency();
  const { table } = useTable();

  const tagsAsText = useMemo(() => {
    const tagsObj = keyBy(tags, "id");
    return item?.tags
      .map((tag: number) => {
        return tagsObj[tag]?.name[locale!];
      })
      .join(", ");
  }, [tags, item?.tags, locale]);

  const price = (() => {
    const { groups, quantity } = values;
    if (!item) {
      return;
    }
    const groupRecord = keyBy(item.optionGroups, "id");
    const optionGroups = Object.entries(groups).map(([key, values]) => {
      const group = groupRecord[key];
      const optionRecord = keyBy(group.options, "id");
      let options = [];
      if (Array.isArray(values)) {
        options = values
          .reduce<Option[][]>((res, option) => {
            const entries = Object.entries(option);
            const selectedOptions = entries.map(([key, value]) => {
              return { ...optionRecord[key], amount: value };
            });
            res.push(selectedOptions.filter((option) => option.amount));
            return res;
          }, [])
          .flat();
      } else {
        if (values !== 0) {
          options.push(optionRecord[values]);
        }
      }

      return { ...group, options };
    });
    const orderItem = { ...item, optionGroups };
    return getItemPrice(orderItem, quantity);
  })();

  return {
    item,
    tagsAsText,
    locale,
    isValid,
    currency,
    coefficient,
    price,
    table,
    showBanner,
    closeBanner,
    bannerMessage,
  };
}
