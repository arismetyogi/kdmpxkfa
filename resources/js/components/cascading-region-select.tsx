import SearchableSelect from '@/components/searchable-select';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface RegionOption {
    code: string;
    name: string;
}

interface CascadingRegionSelectProps {
    onProvinceChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onDistrictChange: (value: string) => void;
    onVillageChange: (value: string) => void;
    initialProvince?: string;
    initialCity?: string;
    initialDistrict?: string;
    initialVillage?: string;
}

export default function CascadingRegionSelect({
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onVillageChange,
    initialProvince,
    initialCity,
    initialDistrict,
    initialVillage,
}: CascadingRegionSelectProps) {
    const [provinces, setProvinces] = useState<RegionOption[]>([]);
    const [cities, setCities] = useState<RegionOption[]>([]);
    const [districts, setDistricts] = useState<RegionOption[]>([]);
    const [villages, setVillages] = useState<RegionOption[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince || '');
    const [selectedCity, setSelectedCity] = useState<string>(initialCity || '');
    const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict || '');
    const [selectedVillage, setSelectedVillage] = useState<string>(initialVillage || '');

    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);

    // Load provinces on component mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                setLoadingProvinces(true);
                const response = await axios.get('/regions/provinces');
                setProvinces(response.data);

                // If there's an initial province, load its cities
                if (initialProvince) {
                    setSelectedProvince(initialProvince);
                    loadCities(initialProvince);
                }
            } catch (error) {
                console.error('Error loading provinces:', error);
            } finally {
                setLoadingProvinces(false);
            }
        };

        loadProvinces();
    }, [initialProvince]);

    // Load cities when province changes
    const loadCities = async (provinceCode: string) => {
        try {
            setLoadingCities(true);
            const response = await axios.get(`/regions/cities/${provinceCode}`);
            setCities(response.data);

            // Reset dependent selections
            setDistricts([]);
            setVillages([]);
            setSelectedCity('');
            setSelectedDistrict('');
            setSelectedVillage('');

            // If there's an initial city, load its districts
            if (initialCity && response.data.some((city: RegionOption) => city.code === initialCity)) {
                setSelectedCity(initialCity);
                loadDistricts(initialCity);
            }
        } catch (error) {
            console.error('Error loading cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Load districts when city changes
    const loadDistricts = async (cityCode: string) => {
        try {
            setLoadingDistricts(true);
            const response = await axios.get(`/regions/districts/${cityCode}`);
            setDistricts(response.data);

            // Reset dependent selections
            setVillages([]);
            setSelectedDistrict('');
            setSelectedVillage('');

            // If there's an initial district, load its villages
            if (initialDistrict && response.data.some((district: RegionOption) => district.code === initialDistrict)) {
                setSelectedDistrict(initialDistrict);
                loadVillages(initialDistrict);
            }
        } catch (error) {
            console.error('Error loading districts:', error);
        } finally {
            setLoadingDistricts(false);
        }
    };

    // Load villages when district changes
    const loadVillages = async (districtCode: string) => {
        try {
            setLoadingVillages(true);
            const response = await axios.get(`/regions/villages/${districtCode}`);
            setVillages(response.data);

            // Reset selection
            setSelectedVillage('');

            // If there's an initial village, select it
            if (initialVillage && response.data.some((village: RegionOption) => village.code === initialVillage)) {
                setSelectedVillage(initialVillage);
                onVillageChange(initialVillage);
            }
        } catch (error) {
            console.error('Error loading villages:', error);
        } finally {
            setLoadingVillages(false);
        }
    };

    // Handle province selection
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        onProvinceChange(value);
        loadCities(value);
    };

    // Handle city selection
    const handleCityChange = (value: string) => {
        setSelectedCity(value);
        onCityChange(value);
        loadDistricts(value);
    };

    // Handle district selection
    const handleDistrictChange = (value: string) => {
        setSelectedDistrict(value);
        onDistrictChange(value);
        loadVillages(value);
    };

    // Handle village selection
    const handleVillageChange = (value: string) => {
        setSelectedVillage(value);
        onVillageChange(value);
    };

    return (
        <div className="space-y-4">
            {/* Province Select */}
            <div className="space-y-2">
                <label htmlFor="province" className="text-sm font-medium">
                    Province *
                </label>
                <SearchableSelect
                    options={provinces.map((p) => ({ label: p.name, value: p.code }))}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    placeholder="Select province..."
                    searchPlaceholder="Search province..."
                    disabled={loadingProvinces}
                />
                {loadingProvinces && <p className="text-sm text-muted-foreground">Loading provinces...</p>}
            </div>

            {/* City Select */}
            <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                    City *
                </label>
                <SearchableSelect
                    options={cities.map((c) => ({ label: c.name, value: c.code }))}
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder={selectedProvince ? 'Select city...' : 'Select a province first'}
                    searchPlaceholder="Search city..."
                    disabled={!selectedProvince || loadingCities}
                />
                {loadingCities && <p className="text-sm text-muted-foreground">Loading cities...</p>}
            </div>

            {/* District Select */}
            <div className="space-y-2">
                <label htmlFor="district" className="text-sm font-medium">
                    District *
                </label>
                <SearchableSelect
                    options={districts.map((d) => ({ label: d.name, value: d.code }))}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder={selectedCity ? 'Select district...' : 'Select a city first'}
                    searchPlaceholder="Search district..."
                    disabled={!selectedCity || loadingDistricts}
                />
                {loadingDistricts && <p className="text-sm text-muted-foreground">Loading districts...</p>}
            </div>

            {/* Village Select */}
            <div className="space-y-2">
                <label htmlFor="village" className="text-sm font-medium">
                    Village *
                </label>
                <SearchableSelect
                    options={villages.map((v) => ({ label: v.name, value: v.code }))}
                    value={selectedVillage}
                    onChange={handleVillageChange}
                    placeholder={selectedDistrict ? 'Select village...' : 'Select a district first'}
                    searchPlaceholder="Search village..."
                    disabled={!selectedDistrict || loadingVillages}
                />
                {loadingVillages && <p className="text-sm text-muted-foreground">Loading villages...</p>}
            </div>
        </div>
    );
}
