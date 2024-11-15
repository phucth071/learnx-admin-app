import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/profile/account-details-form';
import { AccountInfo } from '@/components/dashboard/profile/account-info';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {

  return (
      <Stack spacing={3}>
        <div>
          <Typography variant="h4">Account</Typography>
        </div>
        <Grid container spacing={3}>
          <AccountInfo />
          <Grid lg={8} md={6} xs={12}>
            <AccountDetailsForm />
          </Grid>
        </Grid>
      </Stack>
  );
}
