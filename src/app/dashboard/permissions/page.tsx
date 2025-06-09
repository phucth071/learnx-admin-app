"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Check as CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import dayjs from 'dayjs';

import { axiosPrivate } from '@/axios/axios';

interface RoleRequest {
  id: number;
  newRole: string;
  oldRole: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: number[];
  updatedAt: number[] | null;
  createdBy: number;
  updatedBy: number | null;
  user: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string;
    role: string;
    username: string;
    enabled: boolean;
  };
}

interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: RoleRequest[];
}

function formatDate(dateArray: number[]): string {
  if (!dateArray || dateArray.length < 6) return 'N/A';
  const [year, month, day, hour, minute, second] = dateArray;
  return dayjs(new Date(year, month - 1, day, hour, minute, second)).format('MMM D, YYYY HH:mm');
}

function getStatusColor(status: string): 'warning' | 'success' | 'error' {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'warning';
  }
}

export default function Page(): React.JSX.Element {
  const [roleRequests, setRoleRequests] = React.useState<RoleRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    const fetchRoleRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get<ApiResponse>('/roles/request');
        
        if (response.data.success) {
          setRoleRequests(response.data.data);
        }
      } catch (error) {
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    void fetchRoleRequests();
  }, []);

  // ...existing code...

  const handleAccept = async (requestId: number) => {
    try {
      await axiosPrivate.post(`/roles/handle-change-role/${requestId}`);
      
      setRoleRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'APPROVED' as const }
            : request
        )
      );
    } catch (error) {
      // Handle error appropriately
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await axiosPrivate.post(`/roles/handle-reject/${requestId}`);
      
      setRoleRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'REJECTED' as const }
            : request
        )
      );
    } catch (error) {
      // 
    }
  };

// ...existing code...

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRequests = roleRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Role Change Requests</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Total: {roleRequests.length} requests
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Card>
        <CardHeader title="Requests" />
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role Change</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Requested Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No role requests found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((request) => (
                  <TableRow hover key={request.id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Avatar src={request.user.avatarUrl} sx={{ height: '32px', width: '32px' }}>
                          {request.user.fullName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2">{request.user.fullName}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {request.user.email}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Chip label={request.oldRole} size="small" variant="outlined" />
                        <Typography variant="body2">→</Typography>
                        <Chip label={request.newRole} size="small" color="primary" />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        size="small" 
                        color={getStatusColor(request.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {request.status === 'PENDING' ? (
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                          <Button
                            color="success"
                            size="small"
                            startIcon={<CheckIcon fontSize="var(--icon-fontSize-sm)" />}
                            variant="contained"
                            onClick={() => handleAccept(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            color="error"
                            size="small"
                            startIcon={<XIcon fontSize="var(--icon-fontSize-sm)" />}
                            variant="outlined"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        <Chip 
                          label={request.status} 
                          size="small" 
                          color={getStatusColor(request.status)}
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={roleRequests.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Stack>
  );
}