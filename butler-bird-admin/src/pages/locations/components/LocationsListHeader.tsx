import { ChangeEvent, FC, memo } from "react";
import { SearchInput } from "components/SearchInput";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export const LocationsListHeader: FC<Props> = memo(function LocationsListHeader(
  props
) {
  const { search } = props;
  const { handleSearchChange } = useLocationsListHeader(props);

  return (
    <div className="pv-3 ph-2">
      <SearchInput value={search} onChange={handleSearchChange} />
    </div>
  );
});

function useLocationsListHeader({ onSearchChange }: Props) {
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value ?? "");
  }

  return { handleSearchChange };
}
