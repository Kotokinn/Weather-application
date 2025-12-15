'use client';

import { Autocomplete, TextField } from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import vnTree from '@/components/data.json';

/* =======================
   Types
======================= */
type District = {
    Id: string;
    Name: string;
};

type Province = {
    Id: string;
    Name: string;
    Districts: District[];
};

export type FlatLocation = {
    provinceId: string;
    province: string;
    districtId: string;
    district: string;
    label: string;
    search: string;
};

type Props = {
    value?: FlatLocation | null;
    onSelect?: (value: FlatLocation | null) => void;
};

/* =======================
   Utils
======================= */
function normalizeVN(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function flattenTree(data: Province[]): FlatLocation[] {
    const result: FlatLocation[] = [];

    data.forEach((p) => {
        p.Districts.forEach((d) => {
            const label = `${d.Name}, ${p.Name}`;
            result.push({
                provinceId: p.Id,
                province: p.Name,
                districtId: d.Id,
                district: d.Name,
                label,
                search: normalizeVN(label),
            });
        });
    });

    return result;
}


export default function LocationVNAutocomplete({
    value = null,
    onSelect,
}: Props) {
    const [input, setInput] = useState('');

    // flatten 1 lần
    const data = useMemo(
        () => flattenTree(vnTree as Province[]),
        []
    );

    // sync input khi value ngoài thay đổi
    useEffect(() => {
        if (value) setInput(value.label);
    }, [value]);

    const options = useMemo(() => {
        if (!input) return [];
        const q = normalizeVN(input);

        return data
            .filter((x) => x.search.includes(q))
            .slice(0, 10);
    }, [input, data]);


    return (
        <Autocomplete
            freeSolo
            fullWidth
            value={value}
            options={options}
            getOptionLabel={(o) => (typeof o === 'string' ? o : o.label)}
            inputValue={input}
            onInputChange={(e, v) => setInput(v)}
            noOptionsText="Không tìm thấy quận / huyện"
            onChange={(e, newValue) => {
                if (typeof newValue === 'string') {
                    onSelect?.(null);
                    return;
                }
                onSelect?.(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    placeholder="Quận / Huyện, Tỉnh / TP (VD: Quận 1, TP HCM)"
                    sx={{
                        '& .MuiFilledInput-root': {
                            backgroundColor: '#fff',
                            borderRadius: '30px',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            '&::before, &::after': { display: 'none' },
                            '& .MuiInputBase-input': {
                                padding: '0px 10px 18px 10px',
                                minHeight: 'auto',
                            },
                        },
                    }}
                />
            )}
        />
    );
}
