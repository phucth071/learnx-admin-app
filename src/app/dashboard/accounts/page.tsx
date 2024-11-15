'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
// import dayjs from 'dayjs';

import { AccountsFilters } from '@/components/dashboard/account/accounts-filters';
import { AccountsTable } from '@/components/dashboard/account/accounts-table';
import type { Account } from '@/components/dashboard/account/accounts-table';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios';
import { BaseResponse } from '@/types/base-response';
import { logger } from '@/lib/default-logger';

// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paginatedCustomers, setPaginatedCustomers] = useState<Account[]>([]);

  useEffect(() => {
    axiosPrivate.get<BaseResponse<Account[]>>('/user')
      .then((res) => {
        if (res.status === 200) {
          setAccounts(res.data.data);
        }
      })
      .catch((error: unknown) => {
        logger.error(error);
      });
  }, []);

  useEffect(() => {
    setPaginatedCustomers(applyPagination(accounts, page, rowsPerPage));
  }, [accounts, page, rowsPerPage]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Accounts</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <AccountsFilters />
      <AccountsTable
        count={accounts.length}
        page={page}
        rows={paginatedCustomers}
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
