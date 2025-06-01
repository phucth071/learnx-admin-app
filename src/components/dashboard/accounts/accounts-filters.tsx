'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { FormControl, InputLabel, MenuItem, Select, Stack, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

interface AccountsFiltersProps {
  onFilter: (searchQuery: string, role?: string, status?: string) => void;
}

export function AccountsFilters({ onFilter }: AccountsFiltersProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [role, setRole] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onFilter(value, role, status);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setRole(value);
    onFilter(searchQuery, value, status);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setStatus(value);
    onFilter(searchQuery, role, value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'flex-end' }}>
        <OutlinedInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên hoặc email..."
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '400px', flex: 1 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select value={role} onChange={handleRoleChange} label="Vai trò">
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="admin">Quản trị viên</MenuItem>
            <MenuItem value="teacher">Giảng viên</MenuItem>
            <MenuItem value="student">Sinh viên</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={status} onChange={handleStatusChange} label="Trạng thái">
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Không hoạt động</MenuItem>
            <MenuItem value="pending">Chờ xác thực</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
}