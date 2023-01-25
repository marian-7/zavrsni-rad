import { lazy } from "react";

export const LoginPage = lazy(() => import("./login/LoginPage"));

export const ForgotPasswordPage = lazy(
  () => import("./forgot/ForgotPasswordPage")
);

export const ResetPasswordPage = lazy(
  () => import("./reset/ResetPasswordPage")
);

export const DashboardPage = lazy(() => import("./dashboard/DashboardPage"));

export const PrintersPage = lazy(() => import("./printers/PrintersPage"));

export const MenusPage = lazy(() => import("./menus/MenusPage"));

export const OrdersPage = lazy(() => import("./orders/OrdersPage"));

export const OrdersTicketing = lazy(
  () => import("./ordersTicketing/OrdersTicketingPage")
);

export const CategoriesPage = lazy(() => import("./categories/CategoriesPage"));

export const ItemsPage = lazy(() => import("./items/ItemsPage"));

export const ItemsPickerPage = lazy(
  () => import("./itemsPicker/ItemsPickerPage")
);

export const CategoriesPickerPage = lazy(
  () => import("./categoriesPicker/CategoriesPickerPage")
);

export const CategoryItemsPage = lazy(
  () => import("./categoryItems/CategoryItemsPage")
);

export const MenuPage = lazy(() => import("./menu/MenuPage"));

export const MenuCreatePage = lazy(() => import("./menuCreate/MenuCreatePage"));

export const VenuesPage = lazy(() => import("./venues/VenuesPage"));

export const LocationsPage = lazy(() => import("./locations/LocationsPage"));

export const SettingsPage = lazy(() => import("./settings/SettingsPage"));

export const RegistrationPage = lazy(
  () => import("./registration/RegistrationPage")
);
