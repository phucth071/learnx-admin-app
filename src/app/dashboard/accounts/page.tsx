'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { AccountsFilters } from '@/components/dashboard/accounts/accounts-filters';
import { AccountsTable } from '@/components/dashboard/accounts/accounts-table';
import type { Account } from '@/components/dashboard/accounts/accounts-table';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios';
import { BaseResponse } from '@/types/base-response';
import { logger } from '@/lib/default-logger';

// Interface for API response
interface ApiUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: string;
  createdAt: number[];
  updatedAt: number[] | null;
  username: string;
  enabled: boolean;
  authorities: { authority: string }[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export default function Page(): React.JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [paginatedAccounts, setPaginatedAccounts] = useState<Account[]>([]);

  // Fetch accounts data
  useEffect(() => {
    void fetchAccounts();
  }, []);

  // Apply pagination when accounts or page settings change
  useEffect(() => {
    setPaginatedAccounts(applyPagination(filteredAccounts, page, rowsPerPage));
  }, [filteredAccounts, page, rowsPerPage]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<BaseResponse<ApiUser[]>>('/user');
      
      if (response.status === 200 && response.data.success) {
        const transformedAccounts: Account[] = response.data.data.map(transformApiUserToAccount);
        setAccounts(transformedAccounts);
        setFilteredAccounts(transformedAccounts);
      }
    } catch (error: unknown) {
      logger.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform API user data to Account interface
  const transformApiUserToAccount = (apiUser: ApiUser): Account => {
    // Convert role to Vietnamese and determine status
    const roleMap: Record<string, string> = {
      'ADMIN': 'Quản trị viên',
      'TEACHER': 'Giảng viên',
      'STUDENT': 'Sinh viên'
    };

    return {
      id: apiUser.id.toString(),
      avatarUrl: apiUser.avatarUrl,
      fullName: apiUser.fullName,
      email: apiUser.email,
      role: roleMap[apiUser.role] || apiUser.role
    };
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = (searchQuery: string, role?: string) => {
    let filtered = accounts;

    // Filter by search query (name or email)
    if (searchQuery) {
      filtered = filtered.filter(
        (account: Account) =>
          account.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          account.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (role && role !== 'all') {
      const roleMap: Record<string, string> = {
        'admin': 'Quản trị viên',
        'teacher': 'Giảng viên',
        'student': 'Sinh viên'
      };
      const mappedRole = roleMap[role];
      if (mappedRole) {
        filtered = filtered.filter((account) => account.role === mappedRole);
      }
    }

    setFilteredAccounts(filtered);
    setPage(0); // Reset to first page when filtering
  };
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quản lý tài khoản</Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin tài khoản người dùng trong hệ thống LearnX
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button 
              color="inherit" 
              startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
            >
              Nhập dữ liệu
            </Button>
            <Button 
              color="inherit" 
              startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
            >
              Xuất dữ liệu
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button 
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
            variant="contained"
          >
            Thêm tài khoản
          </Button>
        </div>
      </Stack>
      
      <AccountsFilters onFilter={handleFilter} />
      
      <AccountsTable
        count={filteredAccounts.length}
        page={page}
        rows={paginatedAccounts}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Stack>
  );
}

function applyPagination(rows: Account[], page: number, rowsPerPage: number): Account[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}