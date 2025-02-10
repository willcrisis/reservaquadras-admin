import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { createListCollection, Input } from '@chakra-ui/react';
import { all } from 'country-codes-list';
import { useMemo, useState } from 'react';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

type CountryCodeSelectProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  portalRef?: React.RefObject<HTMLDivElement>;
};

const CountryCodeSelect = <T extends FieldValues>({ field, portalRef }: CountryCodeSelectProps<T>) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const options = useMemo(() => {
    const allcountries = all();

    return createListCollection({
      items: allcountries
        .filter(
          ({ countryNameEn, countryCallingCode }) =>
            countryNameEn.toLowerCase().includes(debouncedSearch.toLowerCase()) || countryCallingCode === field.value,
        )
        .map(({ countryCallingCode, countryNameEn, flag }) => ({
          label: `${flag} +${countryCallingCode} (${countryNameEn})`,
          value: String(countryCallingCode),
        })),
    });
  }, [debouncedSearch, field.value]);

  return (
    <SelectRoot
      name={field.name}
      value={field.value}
      collection={options}
      onValueChange={(ev) => {
        field.onChange(ev.value);
        setSearch('');
      }}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Selecione..." />
      </SelectTrigger>
      <SelectContent portalRef={portalRef}>
        <Input placeholder="Pesquisar" size="xl" p="2" value={search} onChange={(e) => setSearch(e.target.value)} />
        {options.items.map((country) => (
          <SelectItem key={country.label} item={country}>
            {country.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default CountryCodeSelect;
