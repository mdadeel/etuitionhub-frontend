import { MapPin } from 'lucide-react';
import FilterSelect from './FilterSelect';

const DISTRICTS = [
  "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna",
  "Barishal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
  "Narayanganj", "Bogra", "Cox's Bazar", "Jessore", "Dinajpur"
];

/**
 * Location filter with district selection.
 */
const LocationFilter = ({ value, onChange, className }) => {
  return (
    <FilterSelect
      value={value}
      onValueChange={onChange}
      options={DISTRICTS}
      placeholder="All Locations"
      label="Location"
      icon={MapPin}
      className={className}
      searchable={true}
    />
  );
};

export default LocationFilter;
