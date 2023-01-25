import { upperCase } from "lodash";

export function getFlag(iso: string) {
  return `https://raw.githubusercontent.com/ZeroMolecule/zero-presets/master/countries/flags/rounded/${upperCase(
    iso
  )}.svg`;
}
