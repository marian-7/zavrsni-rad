import React, { FC, memo } from "react";
import { CustomRoute } from "../../CustomRoute";
import { paths, withSlug } from "paths";
import { TagsPage } from "pages/tags/TagsPage";
import { ModifierOptionsPage } from "pages/modifierOptions/ModifierOptionsPage";
import { ModifierPage } from "pages/modifier/ModifierPage";
import { ModifiersPage } from "pages/modifiers/ModifiersPage";
import { Switch } from "react-router-dom";
import { ModifierOptionPage } from "pages/modifierOption/ModifierOptionPage";
import { TagPage } from "pages/tag/TagPage";

type Props = {};

export const ItemFormRouteSwitch: FC<Props> = memo(function FormRouteSwitch() {
  useItemFormRouteSwitch();

  return (
    <Switch>
      <CustomRoute
        exact
        path={[
          withSlug(paths.itemCreate(paths.tags()), true),
          withSlug(paths.item(undefined, paths.tags()), true),
        ]}
      >
        <TagsPage />
      </CustomRoute>
      <CustomRoute
        exact
        path={[
          withSlug(paths.itemCreate(paths.tag()), true),
          withSlug(paths.item(undefined, paths.tag()), true),
        ]}
      >
        <TagPage />
      </CustomRoute>
      <CustomRoute
        exact
        path={[
          withSlug(
            paths.item(
              undefined,
              paths.modifierCreate(paths.modifierOptions())
            ),
            true
          ),
        ]}
      >
        <ModifierOptionsPage addFormOpened />
      </CustomRoute>
      <CustomRoute
        exact
        path={[
          withSlug(
            paths.item(
              undefined,
              paths.modifier(undefined, paths.modifierOptions())
            ),
            true
          ),
        ]}
      >
        <ModifierOptionsPage addFormOpened={false} />
      </CustomRoute>
      <CustomRoute
        exact
        path={[
          withSlug(
            paths.item(
              undefined,
              paths.modifier(undefined, paths.modifierOption(undefined))
            ),
            true
          ),
        ]}
      >
        <ModifierOptionPage />
      </CustomRoute>
      <CustomRoute
        exact
        path={[
          withSlug(paths.itemCreate(paths.modifierCreate()), true),
          withSlug(paths.item(undefined, paths.modifierCreate()), true),
        ]}
      >
        <ModifierPage />
      </CustomRoute>
      <CustomRoute
        exact
        path={[
          withSlug(paths.itemCreate(paths.modifiers()), true),
          withSlug(paths.item(undefined, paths.modifiers()), true),
        ]}
      >
        <ModifiersPage />
      </CustomRoute>
    </Switch>
  );
});

function useItemFormRouteSwitch() {
  return {};
}
