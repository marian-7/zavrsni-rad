import { FC, memo } from "react";

type Props = {};

export const DashboardPage: FC<Props> = memo(function DashboardPage() {
  useDashboardPage();

  return null;
});

function useDashboardPage() {
  return {};
}

export default DashboardPage;
